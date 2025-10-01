import TrackerInterface from "@/components/features/TrackerInterface";
import { Wallet } from "lucide-react";

const Tracker = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 mb-4">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-3">Expense Tracker</h1>
        <p className="text-muted-foreground text-lg">
          Chat with AI to track your expenses naturally
        </p>
      </div>
      
      <TrackerInterface />
    </div>
  );
};

export default Tracker;
