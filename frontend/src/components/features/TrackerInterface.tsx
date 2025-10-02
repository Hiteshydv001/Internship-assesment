import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, User, Bot, Trash2, Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
  const [sessionId, setSessionId] = useState<string>(() => {
    // Generate a unique session ID on mount
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  });
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
        body: JSON.stringify({ 
          prompt: userMessage,
          session_id: sessionId 
        }),
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
        
        const chunk = decoder.decode(value, { stream: true });
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

  const handleClearChat = () => {
    setChatHistory([
      {
        role: "ai",
        content: "Hi! I'm your expense tracker. You can add expenses like 'add $20 for coffee' or ask me 'what's my total spending?'"
      }
    ]);
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    setError(null);
    setStreamingMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[600px] animate-fade-in">
      {/* Memory Status Badge */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
          <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
            Memory Active • {chatHistory.length - 1} messages
          </span>
        </div>
        <Button
          type="button"
          onClick={handleClearChat}
          variant="ghost"
          size="sm"
          className="text-xs hover:bg-destructive/10 hover:text-destructive"
          disabled={isLoading}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>

      <Card className="flex-1 overflow-y-auto p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow border-2">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md ${
              message.role === "user" 
                ? "bg-gradient-to-br from-orange-500 to-red-600" 
                : "bg-gradient-to-br from-purple-500 to-pink-600"
            }`}>
              {message.role === "user" ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div
              className={`rounded-2xl px-5 py-3 max-w-[80%] shadow-md ${
                message.role === "user"
                  ? "bg-gradient-to-br from-orange-500 to-red-600 ml-auto"
                  : "bg-muted/80 backdrop-blur-sm"
              }`}
            >
              <div className={`text-sm leading-relaxed prose prose-sm max-w-none ${
                message.role === "user"
                  ? "text-white [&>*]:text-white [&_strong]:text-white [&_p]:text-white [&_code]:text-white"
                  : "dark:prose-invert"
              }`}>
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="rounded-2xl px-5 py-3 bg-muted/80 backdrop-blur-sm shadow-md">
              {streamingMessage ? (
                <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                </div>
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
        <div className="mt-3 p-3 bg-destructive/10 border-2 border-destructive rounded-lg shadow-lg">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type a command or question..."
          disabled={isLoading}
          className="flex-1 border-2 shadow-md focus:shadow-lg transition-shadow"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !prompt.trim()} 
          size="lg"
          className="px-6 shadow-lg hover:shadow-xl transition-all"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default TrackerInterface;
