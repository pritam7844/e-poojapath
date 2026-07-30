"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Flame } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string }

const suggestions = ["Temples near me", "Book a Puja", "What is Chadawa?", "Today's Panchang"];

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "🙏 नमस्ते! I am your ePoojapaath AI Guide. How may I assist you on your devotional journey today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: messages.slice(-10) }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "🙏 I couldn't fetch a response. Please try again." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "🙏 Apologies, I'm temporarily unavailable. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed md:bottom-6 bottom-4 md:right-6 right-4 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full bg-saffron shadow-lg flex items-center justify-center text-white animate-glow-pulse"
        aria-label="Open AI Chat"
      >
        <Flame className="w-5 h-5 md:w-7 md:h-7" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] h-[500px] bg-background rounded-2xl shadow-2xl ring-1 ring-deep-gold/20 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-saffron to-deep-gold px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-heading text-white text-base">ePoojapaath AI Guide 🛕</div>
                <div className="text-white/70 text-xs font-sanskrit">ॐ सर्वे भवन्तु सुखिनः</div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-saffron text-white rounded-br-none"
                      : "bg-card-bg border border-deep-gold/20 text-foreground rounded-bl-none"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-card-bg border border-deep-gold/20 px-4 py-3 rounded-xl rounded-bl-none flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-2 h-2 bg-saffron rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
              {suggestions.map((s) => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-xs bg-saffron/10 text-saffron px-2.5 py-1 rounded-full hover:bg-saffron hover:text-white transition-all duration-200 border border-saffron/20">
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 pb-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask about temples, pujas..."
                className="input-devotional flex-1 text-sm py-2"
              />
              <button onClick={() => sendMessage()}
                className="w-9 h-9 rounded-full bg-saffron flex items-center justify-center text-white hover:bg-deep-gold transition-colors">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
