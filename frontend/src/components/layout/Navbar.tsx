import { Link, useLocation } from "react-router-dom";
import { Bot, Sparkles } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const links = [
    { path: "/", label: "Home" },
    { path: "/qna", label: "Q&A Bot" },
    { path: "/summarizer", label: "Summarizer" },
    { path: "/tracker", label: "Expense Tracker" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Kunal AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <Bot className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
