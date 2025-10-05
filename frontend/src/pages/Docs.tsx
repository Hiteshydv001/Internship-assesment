import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Book, Code2, Layers, Rocket, User, Github, Globe, Server } from "lucide-react";

const Docs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Book className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Kunal AI Documentation
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive AI-powered platform built for internship assessment, featuring Q&A Bot, Text Summarizer, and Expense Tracker
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Badge variant="secondary" className="flex items-center gap-1">
              <User className="w-3 h-3" />
              Internship Project
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              Full Stack
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Rocket className="w-3 h-3" />
              AI Powered
            </Badge>
          </div>
        </div>

        {/* About Section */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5 text-primary" />
              About This Project
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Kunal AI is a full-stack web application developed as part of an internship assessment. 
              This project demonstrates proficiency in modern web development technologies, AI integration, 
              and deployment practices. The platform combines three intelligent features powered by Google Gemini AI 
              to showcase various AI capabilities in a user-friendly interface.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Github className="w-4 h-4" />
              <a 
                href="https://github.com/Hiteshydv001/Internship-assesment" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View on GitHub
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Core Features
            </CardTitle>
            <CardDescription>Three AI-powered tools to enhance productivity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  💬 Q&A Bot
                </h3>
                <p className="text-sm text-muted-foreground">
                  Interactive question-answering system with real-time streaming responses powered by Google Gemini AI
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  📝 Text Summarizer
                </h3>
                <p className="text-sm text-muted-foreground">
                  Intelligent text summarization that extracts key points from long documents using AI
                </p>
              </div>
              <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  💰 Expense Tracker
                </h3>
                <p className="text-sm text-muted-foreground">
                  Natural language expense management with conversational commands for easy tracking
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              Technology Stack
            </CardTitle>
            <CardDescription>Modern technologies used to build this application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Frontend */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold">Frontend</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Badge variant="outline">React 18.3.1</Badge>
                <Badge variant="outline">TypeScript 5.8.3</Badge>
                <Badge variant="outline">Vite 5.4.19</Badge>
                <Badge variant="outline">React Router</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
                <Badge variant="outline">Shadcn UI</Badge>
                <Badge variant="outline">Radix UI</Badge>
                <Badge variant="outline">TanStack Query</Badge>
              </div>
            </div>

            <Separator />

            {/* Backend */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Server className="w-4 h-4 text-green-500" />
                <h3 className="font-semibold">Backend</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Badge variant="outline">Python 3.11</Badge>
                <Badge variant="outline">Flask 3.0.3</Badge>
                <Badge variant="outline">LangChain</Badge>
                <Badge variant="outline">Google Gemini AI</Badge>
                <Badge variant="outline">Flask-CORS</Badge>
                <Badge variant="outline">Gunicorn</Badge>
                <Badge variant="outline">Pydantic</Badge>
                <Badge variant="outline">python-dotenv</Badge>
              </div>
            </div>

            <Separator />

            {/* Deployment */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Rocket className="w-4 h-4 text-purple-500" />
                <h3 className="font-semibold">Deployment & DevOps</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Badge variant="outline">Vercel</Badge>
                <Badge variant="outline">Railway</Badge>
                <Badge variant="outline">Docker</Badge>
                <Badge variant="outline">GitHub Actions</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Architecture */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              System Architecture
            </CardTitle>
            <CardDescription>How the application is structured</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Frontend (React + TypeScript)</h4>
                  <p className="text-sm text-muted-foreground">
                    Single Page Application built with React and TypeScript, utilizing Vite for fast development 
                    and optimized builds. UI components from Shadcn UI provide a modern, accessible interface.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Backend API (Flask)</h4>
                  <p className="text-sm text-muted-foreground">
                    RESTful API built with Flask, featuring CORS-enabled endpoints for Q&A, summarization, 
                    and expense tracking. Uses Gunicorn as WSGI server for production deployment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">AI Integration (LangChain + Gemini)</h4>
                  <p className="text-sm text-muted-foreground">
                    LangChain framework orchestrates AI agents powered by Google Gemini AI, 
                    enabling intelligent responses with streaming capabilities for real-time user experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Deployment</h4>
                  <p className="text-sm text-muted-foreground">
                    Frontend deployed on Vercel for edge optimization, backend containerized with Docker 
                    and deployed on Railway for scalable, reliable hosting.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              API Endpoints
            </CardTitle>
            <CardDescription>Available backend endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border bg-card font-mono text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">POST</Badge>
                  <code className="text-primary">/api/qna</code>
                </div>
                <p className="text-xs text-muted-foreground ml-16">Submit questions and receive AI-generated answers</p>
              </div>

              <div className="p-3 rounded-lg border bg-card font-mono text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">POST</Badge>
                  <code className="text-primary">/api/summarize</code>
                </div>
                <p className="text-xs text-muted-foreground ml-16">Send text for AI-powered summarization</p>
              </div>

              <div className="p-3 rounded-lg border bg-card font-mono text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">POST</Badge>
                  <code className="text-primary">/api/tracker</code>
                </div>
                <p className="text-xs text-muted-foreground ml-16">Natural language expense tracking commands</p>
              </div>

              <div className="p-3 rounded-lg border bg-card font-mono text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">GET</Badge>
                  <code className="text-primary">/api/health</code>
                </div>
                <p className="text-xs text-muted-foreground ml-16">Check API health status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Author */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              About the Developer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              This project was developed by <strong>Hitesh Kumar</strong> as part of an internship assessment 
              to demonstrate full-stack development skills, AI integration capabilities, and modern deployment practices.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <a 
                href="https://github.com/Hiteshydv001" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Github className="w-4 h-4" />
                @Hiteshydv001
              </a>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm font-medium mb-2">🎓 Internship Assessment Project</p>
              <p className="text-xs text-muted-foreground">
                Built to showcase proficiency in React, TypeScript, Flask, AI integration, and modern deployment workflows.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Made with ❤️ for Kunal AI Internship Assessment</p>
        </div>
      </div>
    </div>
  );
};

export default Docs;
