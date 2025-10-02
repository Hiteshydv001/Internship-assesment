import { Link } from "react-router-dom";
import { MessageSquare, FileText, Wallet, Sparkles, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const tools = [
    {
      icon: MessageSquare,
      title: "Q&A Bot",
      description: "Get instant answers to any question with AI-powered intelligence",
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      hoverGradient: "group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600",
      path: "/qna",
      tag: "Smart"
    },
    {
      icon: FileText,
      title: "Summarizer",
      description: "Transform lengthy content into concise, digestible summaries instantly",
      gradient: "from-green-500 via-teal-500 to-cyan-500",
      hoverGradient: "group-hover:from-green-600 group-hover:via-teal-600 group-hover:to-cyan-600",
      path: "/summarizer",
      tag: "Fast"
    },
    {
      icon: Wallet,
      title: "Expense Tracker",
      description: "Manage your finances effortlessly with conversational AI",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      hoverGradient: "group-hover:from-orange-600 group-hover:via-red-600 group-hover:to-pink-600",
      path: "/tracker",
      tag: "Easy"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 -z-10" />
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl relative">
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Powered by Advanced AI
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-gradient">
              Kunal AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Your all-in-one AI-powered productivity suite. <br />
            <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Ask, Summarize, Track
            </span> — effortlessly.
          </p>

          <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Lightning Fast</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>AI-Powered</span>
            </div>
            <span>•</span>
            <span>Free to Use</span>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.path}
                to={tool.path}
                className="group relative block animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -z-10" 
                     style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                
                <div className="relative p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl hover:border-transparent hover:-translate-y-2 transition-all duration-300">
                  {/* Tag */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${tool.gradient} text-white text-xs font-bold shadow-lg`}>
                    {tool.tag}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${tool.gradient} ${tool.hoverGradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h2 className={`text-2xl font-bold mb-3 group-hover:bg-gradient-to-r ${tool.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                    {tool.title}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* CTA Button */}
                  <Button 
                    variant="ghost" 
                    className="w-full group/btn justify-between hover:bg-gradient-to-r hover:text-white"
                    style={{ 
                      background: 'transparent',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      const btn = e.currentTarget;
                      btn.style.background = `linear-gradient(to right, ${tool.gradient.split(' ')[0].replace('from-', '')}, ${tool.gradient.split(' ')[2].replace('to-', '')})`;
                    }}
                    onMouseLeave={(e) => {
                      const btn = e.currentTarget;
                      btn.style.background = 'transparent';
                    }}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 md:mt-24 animate-fade-in">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Experience the future of productivity with AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
