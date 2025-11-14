"use client";

import React, { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      const replyText: string = data.reply ?? "Sorry, I couldn't respond.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: replyText },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Launcher button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 rounded-full px-5 py-3 text-sm font-semibold shadow-xl bg-[#5f43b2] text-white hover:bg-[#6a4ac5] transition-colors"
      >
        {open ? "Close CareQuest AI" : "CareQuest AI"}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-20 right-5 z-40 w-[320px] max-w-[90vw] rounded-2xl border border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur-sm transition-transform duration-200 ${
          open
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Healthcare chatbot
            </div>
            <div className="text-sm font-semibold text-slate-50">
              CareQuest AI
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-slate-200 text-lg"
            aria-label="Close CareQuest AI"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col h-[320px]">
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-sm">
            {messages.length === 0 && (
              <p className="text-xs text-slate-400">
                Ask a brief question about symptoms, urgency, or care options.
                CareQuest AI gives general guidance only — it does not diagnose
                or replace emergency services.
              </p>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`rounded-lg px-3 py-2 max-w-[80%] text-xs whitespace-pre-wrap ${
                  m.role === "user"
                    ? "ml-auto bg-[var(--accent)] text-slate-950"
                    : "mr-auto bg-slate-900 text-slate-100 border border-slate-800"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto rounded-lg px-3 py-2 max-w-[80%] text-xs bg-slate-900 text-slate-400 border border-slate-800">
                Thinking…
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 px-3 py-2">
            <textarea
              rows={2}
              className="w-full resize-none rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              placeholder="Briefly describe your question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="flex justify-end mt-1">
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="text-xs px-3 py-1 rounded-full bg-[var(--accent)] text-slate-950 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
