import OpenAI from "openai";
import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  OPENAI_API_KEY: string;
  AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["X-Custom_Header", "Upgrade-Insecure-Requests", "Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

// Chat to Document Endpoint
app.post("/chatToDocument", async (c) => {
  const openai = new OpenAI({
    apiKey: c.env.OPENAI_API_KEY,
  });

  const { DocumentData, question } = await c.req.json();

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an assistant helping the user to chat with a document. The document content in markdown format is: " +
          DocumentData,
      },
      {
        role: "user",
        content: "My question is: " + question,
      },
    ],
    model: "gpt-4o",
    temperature: 0.5,
  });

  const response = chatCompletion.choices[0].message.content;
  return c.json({ message: response });
});

// Translate Entire Document Endpoint
app.post("/translateDocument", async (c) => {
  const { DocumentData, targetLang } = await c.req.json();

  const response = await c.env.AI.run("@cf/meta/m2m100-1.2b", {
    text: DocumentData,
    source_lang: "english",
    target_lang: targetLang,
  });

  return new Response(JSON.stringify({ translatedText: response }));
});

export default app;
