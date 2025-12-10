"use client";

import { useState } from "react";
import {
  Bot,
  MessageCircle,
  Lightbulb,
  Shuffle,
  Replace,
  X,
  Send,
  Sparkles,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/lib/types";

type TabId = "chat" | "substitutions" | "tips" | "variations";

interface AIRecipeAssistantProps {
  recipe: Recipe;
}

const chatSuggestions = [
  "Πώς μπορώ να κάνω αυτή τη συνταγή vegan;",
  "Πώς να γίνει πιο τραγανό το αποτέλεσμα;",
  "Μπορώ να την ετοιμάσω από την προηγούμενη μέρα;",
  "Πώς να αποθηκεύσω σωστά τα υπολείμματα;",
];

const substitutionSuggestions = [
  "Τι μπορώ να βάλω αντί για βούτυρο;",
  "Εναλλακτικές για αυγό σε αυτή τη συνταγή;",
  "Πώς να την κάνω χωρίς γλουτένη;",
];

const tipsSuggestions = [
  "Μυστικά για πιο έντονη γεύση;",
  "Πώς να μην κολλήσει στο ταψί;",
  "Πώς να σερβίρω αυτή τη συνταγή πιο εντυπωσιακά;",
];

const variationSuggestions = [
  "Ιδέες για πιο ελαφριά εκδοχή;",
  "Πώς να την προσαρμόσω για περισσότερα άτομα;",
  "Τι μπορώ να προσθέσω για πιο πικάντικη γεύση;",
];

export function AIRecipeAssistant({ recipe }: AIRecipeAssistantProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Dummy local chat – μπορείς να το συνδέσεις με API αργότερα
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input.trim() },
      {
        role: "assistant",
        content:
          "Αυτή είναι μια προτεινόμενη απάντηση. Εδώ μπορούμε να συνδέσουμε το πραγματικό AI backend.",
      },
    ]);
    setInput("");
  };

  const getSuggestionsForTab = () => {
    switch (activeTab) {
      case "chat":
        return chatSuggestions;
      case "substitutions":
        return substitutionSuggestions;
      case "tips":
        return tipsSuggestions;
      case "variations":
        return variationSuggestions;
      default:
        return [];
    }
  };

  const tabLabel = (tab: TabId) => {
    switch (tab) {
      case "chat":
        return "Chat";
      case "substitutions":
        return "Substitutions";
      case "tips":
        return "Tips";
      case "variations":
        return "Variations";
    }
  };

  if (!recipe) return null;

  return (
    <>
      {/* Floating button που ανοίγει το panel */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          className="rounded-full px-5 py-3 bg-gradient-to-r from-fuchsia-500 to-orange-400 shadow-lg shadow-fuchsia-500/40 hover:scale-105 transition-transform"
          onClick={() => setOpen(true)}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          AI Cooking Assistant
        </Button>
      </div>

      {/* Side panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md md:max-w-lg bg-[#05040A] rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            {/* Header */}
            <div className="relative px-5 py-4 bg-gradient-to-r from-fuchsia-500 to-orange-400">
              <div className="flex items-center gap-3 text-white">
                <div className="w-9 h-9 rounded-full bg-black/15 flex items-center justify-center border border-white/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">AI Cooking Assistant</div>
                  <div className="text-xs text-white/80">
                    Powered by Gemini 1.5
                  </div>
                </div>
              </div>
              <button
                className="absolute right-4 top-4 text-white/80 hover:text-white"
                onClick={() => setOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 bg-black/40 text-sm">
              {(["chat", "substitutions", "tips", "variations"] as TabId[]).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 text-center transition-colors ${activeTab === tab
                        ? "text-white border-b-2 border-fuchsia-400 bg-white/5"
                        : "text-white/50 hover:text-white/80"
                      }`}
                  >
                    {tab === "chat" && (
                      <MessageCircle className="inline-block w-4 h-4 mr-1" />
                    )}
                    {tab === "substitutions" && (
                      <Replace className="inline-block w-4 h-4 mr-1" />
                    )}
                    {tab === "tips" && (
                      <Lightbulb className="inline-block w-4 h-4 mr-1" />
                    )}
                    {tab === "variations" && (
                      <Shuffle className="inline-block w-4 h-4 mr-1" />
                    )}
                    {tabLabel(tab)}
                  </button>
                )
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 bg-gradient-to-b from-black/80 to-[#05040A] text-white">
              {/* Prompt text ανά tab */}
              <div className="text-sm text-white/80">
                {activeTab === "chat" && (
                  <>Ρώτησέ με οτιδήποτε για αυτή τη συνταγή!</>
                )}
                {activeTab === "substitutions" && (
                  <>Ρώτα για αντικαταστάσεις υλικών στη συνταγή.</>
                )}
                {activeTab === "tips" && (
                  <>Ζήτα μικρά μυστικά για καλύτερο αποτέλεσμα.</>
                )}
                {activeTab === "variations" && (
                  <>Ζήτα εναλλακτικές εκδοχές της συνταγής.</>
                )}
              </div>

              {/* ✅ Σταθερά ορατές προτάσεις – ΧΩΡΙΣ hover opacity */}
              <div className="space-y-2">
                {getSuggestionsForTab().map((text) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => handleSuggestionClick(text)}
                    className="w-full text-left px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm text-white transition-colors"
                  >
                    {text}
                  </button>
                ))}
              </div>

              {/* Μικρό ιστορικό μηνυμάτων */}
              {messages.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-2 mt-2">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`px-3 py-2 rounded-2xl text-xs leading-snug ${m.role === "user"
                          ? "bg-fuchsia-500/20 self-end ml-6"
                          : "bg-white/5 mr-6"
                        }`}
                    >
                      {m.content}
                    </div>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="flex items-end gap-2 pt-2 border-t border-white/10 mt-2">
                <textarea
                  rows={2}
                  className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 resize-none"
                  placeholder="Ρώτησέ με κάτι..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button
                  size="icon"
                  className="rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-400 hover:from-fuchsia-600 hover:to-orange-500 border-0"
                  onClick={handleSend}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
