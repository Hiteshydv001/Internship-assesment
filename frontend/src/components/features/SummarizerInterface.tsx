import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

const SummarizerInterface = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) return;

    setIsLoading(true);
    setSummary("");
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${apiUrl}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error('Response body is missing.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        setSummary((prev) => prev + chunk);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="text" className="block text-sm font-medium text-foreground">
            Paste your text or article
          </label>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a long article or text here and get a concise summary..."
            className="min-h-[200px] resize-y border-2 focus:border-primary transition-colors"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            {text.length} characters
          </p>
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !text.trim()}
          className="w-full sm:w-auto px-6 shadow-lg hover:shadow-xl transition-shadow"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Summarizing...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-5 w-5" />
              Generate Summary
            </>
          )}
        </Button>
      </form>

      {error && (
        <Card className="p-4 border-2 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </Card>
      )}

      {summary && (
        <Card className="p-6 shadow-lg border-2 hover:shadow-xl transition-shadow animate-fade-in bg-gradient-to-br from-background to-muted/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-3 text-foreground">Summary</h3>
              <div className="text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SummarizerInterface;
