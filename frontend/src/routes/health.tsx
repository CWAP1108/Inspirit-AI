import { createRoute } from '@tanstack/react-router';
import { Activity, ArrowRight } from 'lucide-react';
import { rootRoute } from './__root';

export const healthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/health',
  component: HealthPage,
});

function HealthPage() {
  return (
    <div className="rounded-3xl border border-emerald-800/60 bg-emerald-950/30 p-8 shadow-xl shadow-emerald-950/20">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
          <Activity size={20} />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Service health</p>
          <h2 className="text-2xl font-semibold text-white">Frontend is running and ready.</h2>
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-slate-300">
        This route is ready to be connected to your backend health endpoint so you can verify API and database status in one place.
      </p>
      <a className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-300" href="/">
        Go back home <ArrowRight size={16} />
      </a>
    </div>
  );
}
