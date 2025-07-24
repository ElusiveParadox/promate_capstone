'use client'

import * as Y from "yjs";
import Markdown from "react-markdown";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "./ui/button";
import {useState, useTransition } from "react";
import { BotIcon, LanguagesIcon } from "lucide-react";
import { toast } from "sonner";

type Language = 
| "english"
| "spanish"
| "portuguese"
| "french"
| "german"
| "chinese"
| "arabic"
| "hindi"
| "russian"
| "japanese";

const languages: Language[] = [
    "english", 
    "spanish", 
    "portuguese", 
    "french", 
    "german", 
    "chinese", 
    "arabic", 
    "hindi", 
    "russian", 
    "japanese"
];



function TranslateDocument({doc}:{doc: Y.Doc}) {
    const [isOpen, setIsOpen] = useState(false);
    const [summary, setSummary] = useState("");
    const [language, setLanguage] = useState<string>("");
    const [question, setQuestion] = useState("");
    const [isPending, startTransition] = useTransition();

    //-------------------------------------------------------------------------------

    // const handleAskQuestion = (e: React.FormEvent) => {
    //     e.preventDefault();

    //     startTransition(async () => {
    //         const DocumentData = doc.get("document-store").toJSON();
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,{
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 DocumentData,
    //                 targetLang: language,
    //             })

    //         })
    //         if (res.ok) {
    //         const {translated_text} = await res.json();
    //         setSummary(translated_text);
    //         toast.success("Translated summary successfully.");
    //         }
    //     })
    // }

    //-----------------------------------------------------------------------------

    const handleAskQuestion = (e: React.FormEvent) => {
        e.preventDefault();
      
        startTransition(async () => {
          const ytext = doc.getText("document-store"); // use Y.Text
          const DocumentData = ytext.toString(); // safe way to get content
      
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                DocumentData,
                targetLang: language,
              }),
            });
      
            if (!res.ok) {
              const errText = await res.text();
              console.error("API error:", res.status, errText);
              toast.error("Failed to translate.");
              return;
            }
      
            const { translated_text } = await res.json();
            setSummary(translated_text);
            toast.success("Translated summary successfully.");
          } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Network error or invalid endpoint.");
          }
        });
      };
      
  return (
    <div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button asChild variant="outline">
            <DialogTrigger>
                <LanguagesIcon/>
                Translate
            </DialogTrigger>
          </Button>
          <DialogContent> 
            <DialogHeader>
              <DialogTitle>Translate the document.</DialogTitle>
              <DialogDescription>
              Choose a language to receive an AI-generated summary of the document in that language.
              </DialogDescription>
              <hr className="mt-5"/>
              {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
            </DialogHeader>

            {summary && (
                <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-500">
                    <div className="flex">
                        <BotIcon className="w-10 flex-shrink-0"/>
                        <p className="font-bold">
                            GPT{isPending ? "is thinking..." : "Says:"}
                        </p>
                    </div>
                    <p>{isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}</p>
                </div>
            )}
            
            <form className="flex gap-2" onSubmit={handleAskQuestion}>
                <Select
                value={language}
                onValueChange={(value) => setLanguage(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Language."/>
                    </SelectTrigger>

                    <SelectContent>
                        {languages.map((language) => (
                            <SelectItem key={language} value={language}>
                                {language.charAt(0).toUpperCase() + language.slice(1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button type="submit" disabled={!language || isPending}>
                    {isPending ? "Translating..." : "Translate"}
                </Button>
            </form>
          </DialogContent>
        </Dialog>
    </div> 
  )
}

export default TranslateDocument
