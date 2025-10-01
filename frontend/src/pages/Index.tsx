import { Link } from "react-router-dom";
import { MessageSquare, FileText, Wallet } from "lucide-react";

const Index = () => {
  const tools = [
    {
      icon: MessageSquare,
      title: "Q&A Bot",
      description: "Ask questions, get answers",
      path: "/qna"
    },
    {
      icon: FileText,
      title: "Summarizer",
      description: "Condense long text into key points",
      path: "/summarizer"
    },
    {
      icon: Wallet,
      title: "Expense Tracker",
      description: "Track spending with chat",
      path: "/tracker"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-20 max-w-5xl">
      <div className="text-center mb-20 animate-fade-in">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          Powered by AI
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          Kunal AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Three powerful tools to boost your productivity
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.path}
              to={tool.path}
              className="group block p-8 rounded-xl border bg-card hover:shadow-elegant hover:border-primary/50 transition-smooth hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-lg bg-gradient-primary flex items-center justify-center mb-6">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-3">
                {tool.title}
              </h2>
              <p className="text-muted-foreground">
                {tool.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
