import SummarizerInterface from "@/components/features/SummarizerInterface";
import { FileText } from "lucide-react";

const Summarizer = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Text Summarizer</h1>
        <p className="text-muted-foreground text-lg">
          Transform long content into concise summaries
        </p>
      </div>
      
      <SummarizerInterface />
    </div>
  );
};

export default Summarizer;
