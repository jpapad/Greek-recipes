"use client";

import { useState } from "react";
import { Recipe } from "@/lib/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, Lightbulb, RefreshCw, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIRecipeAssistantProps {
  recipe: Recipe;
}

export function AIRecipeAssistant({ recipe }: AIRecipeAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'substitutions' | 'tips' | 'variations'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [substitutions, setSubstitutions] = useState<any>(null);
  const [tips, setTips] = useState<any>(null);
  const [variation, setVariation] = useState<any>(null);
  const { showToast } = useToast();

  const handleChat = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          recipe,
          conversationHistory: messages
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        if (response.status === 429) {
          showToast('Too many requests. Please wait 1 minute and try again.', 'error');
        } else {
          showToast(data.error, 'error');
        }
        return;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      showToast('Failed to get AI response', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSubstitutions = async () => {
    if (!recipe.ingredients) return;
    setLoading(true);
    
    try {
      const response = await fetch('/api/ai/substitutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: recipe.ingredients, recipe }),
      });

      const data = await response.json();
      setSubstitutions(data);
    } catch (error) {
      showToast('Failed to load substitutions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadTips = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/ai/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe }),
      });

      const data = await response.json();
      setTips(data);
    } catch (error) {
      showToast('Failed to load tips', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadVariation = async (type: string) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/ai/variations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe, variationType: type }),
      });

      const data = await response.json();
      setVariation(data);
    } catch (error) {
      showToast('Failed to generate variation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Πώς μπορώ να κάνω αυτή τη συνταγή vegan;",
    "Ποιο κρασί ταιριάζει καλύτερα;",
    "Μπορώ να την ετοιμάσω από την προηγούμενη μέρα;",
    "Πώς να αποθηκεύσω τα υπολείμματα;",
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white gap-2 z-40 print:hidden"
      >
        <Bot className="w-5 h-5" />
        <span>Ρώτησε το AI</span>
        <Sparkles className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-md z-40 print:hidden">
      <GlassPanel className="shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6" />
            <div>
              <h3 className="font-bold">AI Cooking Assistant</h3>
              <p className="text-xs opacity-90">Powered by Gemini 1.5</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border/50">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activeTab === 'chat' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-muted-foreground'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => {
              setActiveTab('substitutions');
              if (!substitutions) loadSubstitutions();
            }}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activeTab === 'substitutions' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-muted-foreground'
            }`}
          >
            Substitutions
          </button>
          <button
            onClick={() => {
              setActiveTab('tips');
              if (!tips) loadTips();
            }}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activeTab === 'tips' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-muted-foreground'
            }`}
          >
            <Lightbulb className="w-4 h-4 inline mr-1" />
            Tips
          </button>
          <button
            onClick={() => setActiveTab('variations')}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activeTab === 'variations' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-muted-foreground'
            }`}
          >
            <RefreshCw className="w-4 h-4 inline mr-1" />
            Variations
          </button>
        </div>

        {/* Content */}
        <div className="p-4 h-96 overflow-y-auto">
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Ρώτησέ με οτιδήποτε για αυτή τη συνταγή!</p>
                  <div className="mt-4 space-y-2">
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(q)}
                        className="block w-full text-left p-2 text-xs bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/70 text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/70 p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'substitutions' && (
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Generating substitutions...</p>
                </div>
              ) : substitutions?.substitutions ? (
                substitutions.substitutions.map((sub: any, i: number) => (
                  <div key={i} className="bg-white/70 p-3 rounded-lg">
                    <div className="font-semibold text-sm">{sub.original}</div>
                    <div className="text-sm text-purple-600 mt-1">→ {sub.substitute}</div>
                    <div className="text-xs text-muted-foreground mt-1">{sub.reason}</div>
                    {sub.adjustment && (
                      <div className="text-xs text-foreground/70 mt-1 italic">{sub.adjustment}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">Click to generate ingredient substitutions</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Generating tips...</p>
                </div>
              ) : tips?.tips ? (
                tips.tips.map((tip: any, i: number) => (
                  <div key={i} className="bg-white/70 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-sm">{tip.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{tip.description}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">Click to generate cooking tips</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'variations' && (
            <div className="space-y-3">
              {!variation ? (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => loadVariation('vegetarian')}
                    disabled={loading}
                    className="text-xs"
                  >
                    🌱 Vegetarian
                  </Button>
                  <Button
                    onClick={() => loadVariation('vegan')}
                    disabled={loading}
                    className="text-xs"
                  >
                    🥬 Vegan
                  </Button>
                  <Button
                    onClick={() => loadVariation('quick')}
                    disabled={loading}
                    className="text-xs"
                  >
                    ⚡ Quick
                  </Button>
                  <Button
                    onClick={() => loadVariation('gourmet')}
                    disabled={loading}
                    className="text-xs"
                  >
                    👨‍🍳 Gourmet
                  </Button>
                  <Button
                    onClick={() => loadVariation('budget')}
                    disabled={loading}
                    className="text-xs"
                  >
                    💰 Budget
                  </Button>
                  <Button
                    onClick={() => loadVariation('spicy')}
                    disabled={loading}
                    className="text-xs"
                  >
                    🌶️ Spicy
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    onClick={() => setVariation(null)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    ← Back to options
                  </Button>
                  
                  <div className="bg-white/70 p-4 rounded-lg space-y-3">
                    <h4 className="font-bold">{variation.title}</h4>
                    <p className="text-sm text-muted-foreground">{variation.description}</p>
                    
                    <div>
                      <div className="font-semibold text-sm mb-2">Ingredients:</div>
                      <ul className="text-xs space-y-1">
                        {variation.ingredients?.map((ing: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span>•</span>
                            <span>{ing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-sm mb-2">Key Changes:</div>
                      <ul className="text-xs space-y-1">
                        {variation.changes?.map((change: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span>✓</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Time: {variation.time_minutes} minutes
                    </div>
                  </div>
                </div>
              )}
              
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Creating variation...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input (only for chat tab) */}
        {activeTab === 'chat' && (
          <div className="border-t border-border/50 p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Ρώτησέ με κάτι..."
                disabled={loading}
              />
              <Button
                onClick={handleChat}
                disabled={loading || !input.trim()}
                size="icon"
                className="bg-purple-500 hover:bg-purple-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
