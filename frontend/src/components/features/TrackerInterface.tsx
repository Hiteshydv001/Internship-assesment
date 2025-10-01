import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, User, Bot } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

const TrackerInterface = () => {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      role: "ai",
      content: "Hi! I'm your expense tracker. You can add expenses like 'add $20 for coffee' or ask me 'what's my total spending?'"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading, streamingMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;

    const userMessage = prompt.trim();
    setPrompt("");
    setIsLoading(true);
    setError(null);
    setStreamingMessage("");

    setChatHistory(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiUrl}/tracker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error('Response body is missing.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setStreamingMessage(fullResponse);
      }

      setChatHistory(prev => [...prev, { role: "ai", content: fullResponse }]);
      setStreamingMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setChatHistory(prev => [
        ...prev,
        { role: "ai", content: "Sorry, I encountered an error. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] animate-fade-in">
      <Card className="flex-1 overflow-y-auto p-4 space-y-4 shadow-elegant">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              message.role === "user" 
                ? "bg-primary" 
                : "bg-gradient-primary"
            }`}>
              {message.role === "user" ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div
              className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-muted">
              {streamingMessage ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{streamingMessage}</p>
              ) : (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </Card>

      {error && (
        <div className="mt-2 p-2 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type a command or question..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !prompt.trim()} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default TrackerInterface;
