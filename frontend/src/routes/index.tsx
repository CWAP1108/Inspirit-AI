import { createRoute } from '@tanstack/react-router';
import { ArrowRight, BrainCircuit, DatabaseZap, ShieldCheck } from 'lucide-react';
import { rootRoute } from './__root';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

function HomePage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-cyan-950/20">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
          <BrainCircuit size={16} /> Ready for rapid product delivery
        </p>
        <h2 className="text-4xl font-semibold tracking-tight text-white">A modern full-stack starter for AI products.</h2>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          This workspace now includes a Vite + React + TypeScript frontend, a Hono backend, PostgreSQL support, and Docker-ready infrastructure.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400" href="/health">
            View health check <ArrowRight size={16} />
          </a>
          <a className="rounded-full border border-slate-700 px-4 py-2 font-medium text-slate-200 transition hover:bg-slate-800" href="https://vite.dev" target="_blank" rel="noreferrer">
            Vite docs
          </a>
        </div>
      </section>
      <aside className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-white">Production-minded setup</h3>
            <p className="text-sm text-slate-400">Includes linting, formatting, and a clean app structure.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-fuchsia-500/10 p-3 text-fuchsia-400">
            <DatabaseZap size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-white">Postgres-ready backend</h3>
            <p className="text-sm text-slate-400">The API is wired for a PostgreSQL connection via environment variables.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
