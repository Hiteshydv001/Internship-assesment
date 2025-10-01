import QnaInterface from "@/components/features/QnaInterface";
import { MessageSquare } from "lucide-react";

const Qna = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-3">AI Q&A Bot</h1>
        <p className="text-muted-foreground text-lg">
          Ask me anything and I'll provide intelligent answers
        </p>
      </div>
      
      <QnaInterface />
    </div>
  );
};

export default Qna;
