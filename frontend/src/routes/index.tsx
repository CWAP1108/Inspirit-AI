import { createRoute } from '@tanstack/react-router';
import { BrainCircuit, RotateCcw, SendHorizonal, ShieldCheck, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { rootRoute } from './__root';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const starterMessages: ChatMessage[] = [
  {
    role: 'assistant',
    content: 'What has been weighing on you lately?',
  },
];

function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const conversation = useMemo(
    () => messages.map((message) => ({ role: message.role, content: message.content })),
    [messages],
  );

  async function sendMessage(nextInput?: string) {
    const messageText = (nextInput ?? input).trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: messageText };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://worker-shrill-wood-4108.calebwuap.workers.dev/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to reach the chatbot service.');
      }

      setMessages((current) => [...current, { role: 'assistant', content: data.reply || 'I’m here with you.' }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setMessages(starterMessages);
    setInput('');
    setError('');
  }

  function handleSummaryRequest() {
    sendMessage('Please provide a clear screening summary of our conversation so far, including symptoms, duration, impact, risk level, and next steps.');
  }

  return (
    <div className="mx-auto max-w-4xl">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-950/20 md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
              <BrainCircuit size={20} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Inspirit AI</p>
              <h2 className="text-2xl font-semibold text-white">💬 Psychologist-Style Screening & Support Chatbot 1</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        <p className="mb-6 max-w-2xl text-sm text-slate-300">
          Screening & support only (not diagnosis or therapy). Your data stays in this session unless you choose to save it.
        </p>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSummaryRequest}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles size={16} /> Ask for summary
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            <ShieldCheck size={16} /> Safety-conscious screening flow
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                message.role === 'user'
                  ? 'ml-auto bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-slate-100'
              }`}
            >
              {message.content}
            </div>
          ))}

          {isLoading && (
            <div className="max-w-[85%] rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-200">Thinking…</div>
          )}

          {error && <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}
        </div>

        <form
          className="mt-6 flex gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void sendMessage();
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your message…"
            className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SendHorizonal size={16} /> Send
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          {conversation.length > 0 ? `Conversation length: ${conversation.length} messages` : 'No messages yet'}
        </p>
      </section>
    </div>
  );
}
