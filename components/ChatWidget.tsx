"use client";

import React, { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const EXAMPLE_PROMPTS = [
  "I have chest tightness and a cough. Is this urgent?",
  "Should I go to urgent care or wait for my family doctor?",
  "I have mild fever and sore throat. What kind of care is usually recommended?",
];

interface ChatWidgetProps {
  medicalHistory?: string;
}

export default function ChatWidget({ medicalHistory = "" }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendToApi = async (nextMessages: Message[]) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: nextMessages,
        medicalHistory,
      }),
    });

    const data = await res.json();
    const replyText: string = data.reply ?? "Sorry, I couldn't respond.";

    setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
  };

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
      await sendToApi(nextMessages);
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

  const handleSummarize = async () => {
    if (loading || messages.length === 0) return;

    const historyPart = medicalHistory.trim()
      ? `Here is the patient's medical history:\n${medicalHistory}\n\n`
      : "";

    const summaryPrompt =
      historyPart +
      "Based on the entire conversation above, please provide a short, patient-friendly summary of what the patient is experiencing and a brief triage suggestion about what level of care may be appropriate (for example, self-care, family doctor, walk-in clinic, urgent care, or emergency). Do not give a diagnosis.";

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: summaryPrompt },
    ];

    setMessages(nextMessages);
    setLoading(true);

    try {
      await sendToApi(nextMessages);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn’t generate a summary right now. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <section className="rounded-3xl border border-[var(--lavender-400)] bg-[var(--popup-bg)]/95 p-5 shadow-2xl shadow-black/40 text-slate-50">
      <header className="mb-4 space-y-1">
        <span className="inline-flex items-center rounded-full bg-[var(--maroon-500)]/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide">
          CareQuest AI
        </span>
        <h3 className="text-lg font-semibold">
          Ask about your symptoms &amp; care options
        </h3>
        <p className="max-w-lg text-xs text-slate-300">
          Type a short question about your symptoms, how urgent they might be, or
          what kind of clinic could be appropriate. CareQuest AI provides general
          guidance only and does not replace a doctor or emergency services.
        </p>
      </header>

      {/* Example prompts */}
      <div className="mb-3 flex flex-wrap gap-2 text-[11px]">
        <span className="mr-1 self-center text-slate-400">Try asking:</span>
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleExampleClick(prompt)}
            className="rounded-full border border-[var(--lavender-400)] bg-black/20 px-3 py-1 text-left text-[11px] text-slate-100 hover:bg-black/35"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat body */}
      <div className="flex h-[260px] flex-col rounded-2xl border border-slate-800 bg-black/30">
        <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3 text-xs">
          {messages.length === 0 && !loading && (
            <p className="text-[11px] text-slate-300">
              Start by describing what you&apos;re feeling and how long it&apos;s
              been going on. When you&apos;re done, you can ask CareQuest AI to
              summarize the conversation and suggest what level of care might be
              appropriate. Your saved medical history can be included in that
              summary.
            </p>
          )}

          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 ${
                m.role === "user"
                  ? "ml-auto bg-[var(--accent)] text-slate-950"
                  : "mr-auto border border-slate-800 bg-slate-900 text-slate-100"
              }`}
            >
              {m.content}
            </div>
          ))}

          {loading && (
            <div className="mr-auto max-w-[80%] rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400">
              Thinking…
            </div>
          )}
        </div>

        <div className="border-t border-slate-800 px-3 py-2">
          <textarea
            rows={2}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="Briefly describe your question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] text-slate-500">
              Summaries may use your saved medical history from the patient
              profile.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleSummarize}
                disabled={loading || messages.length === 0}
                className="rounded-full border border-slate-500 bg-transparent px-3 py-1 text-[11px] text-slate-100 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Summarize visit
              </button>
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
