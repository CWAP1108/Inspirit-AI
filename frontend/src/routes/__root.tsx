import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Home, ShieldCheck, Sparkles } from 'lucide-react';

export const rootRoute = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Inspirit AI</p>
            <h1 className="text-xl font-semibold">Screening & support chatbot</h1>
          </div>
          <nav className="flex gap-2 text-sm text-slate-300">
            <a className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-2" href="/">
              <Home size={16} /> Chat
            </a>
            <a className="flex items-center gap-2 rounded-full border border-slate-700 px-3 py-2" href="/health">
              <ShieldCheck size={16} /> Health
            </a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800 px-6 py-6 text-center text-sm text-slate-400">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2">
          <Sparkles size={16} className="text-cyan-400" /> Screening & support only — not diagnosis or therapy.
        </div>
      </footer>
    </div>
  );
}
