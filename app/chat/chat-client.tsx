"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/chat-message";

interface Sequence {
  id: string;
  name: string;
  subject: string;
  emoji: string;
  _count: { documents: number };
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  sequences: Sequence[];
}

export default function ChatClient({ sequences }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(
    sequences.length === 1 ? sequences[0].id : null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const selected = sequences.find((s) => s.id === selectedId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || !selectedId || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sequenceId: selectedId,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok || !response.body) throw new Error("Erreur réseau");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantText };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Désolé, une erreur est survenue. Réessaie." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (sequences.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-4">💬</p>
        <p className="font-semibold text-gray-900 mb-2">Aucune séquence disponible</p>
        <p className="text-sm text-gray-500">Crée une séquence et uploade des documents pour commencer.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Sequence selector */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-200 bg-white">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Séquence</p>
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {sequences.map((seq) => (
            <button
              key={seq.id}
              onClick={() => {
                if (seq.id !== selectedId) {
                  setSelectedId(seq.id);
                  setMessages([]);
                }
              }}
              disabled={seq._count.documents === 0}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedId === seq.id
                  ? "bg-blue-600 text-white"
                  : seq._count.documents === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{seq.emoji}</span>
              <span>{seq.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {!selectedId && (
          <p className="text-center text-gray-400 text-sm py-8">
            Choisis une séquence pour commencer à poser des questions
          </p>
        )}

        {selectedId && messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-3xl mb-3">{selected?.emoji}</p>
            <p className="font-semibold text-gray-900 mb-1">{selected?.name}</p>
            <p className="text-sm text-gray-400">
              Pose une question sur ton cours !
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}

        {loading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center h-4">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-3 border-t border-gray-200 bg-white">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!selectedId || loading}
            placeholder={selectedId ? "Pose ta question…" : "Sélectionne une séquence"}
            rows={1}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-slate-50 text-sm focus:outline-none focus:bg-white focus:border-blue-500 resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !selectedId || loading}
            className="p-3 bg-blue-600 text-white rounded-xl disabled:opacity-40 shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
