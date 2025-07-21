import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";

export default function Home() {
  return (
    <div>
      <main className="flex space-x-2 items-center animate-pulse">
        <ArrowLeftCircle className="w-12 h-12"/>
        <h1>Let's Build an API Productivity app</h1>
      </main>
    </div>  
  );
}
