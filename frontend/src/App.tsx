import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Layers, 
  Database, 
  Server, 
  ShieldCheck, 
  Cpu, 
  ArrowRight,
  Sparkles,
  GitBranch
} from 'lucide-react';
import { apiClient } from './lib/axios';

interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Automatically apply dark mode class
    document.documentElement.classList.add('dark');

    const checkBackendHealth = async () => {
      try {
        setLoading(true);
        // Calls GET http://localhost:5000/api/v1/health
        const res = (await apiClient.get('/health')) as unknown as { data: HealthData };
        setHealth(res.data);
        setError(null);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Unable to connect to Backend API';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    checkBackendHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              DEV<span className="text-indigo-400">FLOW</span>
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              v1.0.0 Architecture
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 01: Foundation Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise Multi-Tenant SaaS Workspace</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Next-Gen Project Management Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">High-Velocity Teams</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Full-stack production platform powered by React, Express, TypeORM, PostgreSQL on Supabase, Redis, and real-time Socket.IO.
          </p>
        </div>

        {/* Foundation Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Backend API Engine */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-lg mb-2">Express & TypeORM API</h3>
            <p className="text-slate-400 text-sm mb-4">
              Pragmatic Layered Architecture with Zod validation, correlation IDs, and unified error handling.
            </p>
            <div className="flex items-center space-x-2 text-xs">
              {loading ? (
                <span className="text-amber-400 animate-pulse">Checking API status...</span>
              ) : error ? (
                <span className="text-slate-400">Offline (Start backend with: <code className="text-indigo-300 font-mono">npm run dev:backend</code>)</span>
              ) : (
                <span className="inline-flex items-center text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> API Connected ({health?.environment})
                </span>
              )}
            </div>
          </div>

          {/* Card 2: Database Layer */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-lg mb-2">PostgreSQL & Supabase</h3>
            <p className="text-slate-400 text-sm mb-4">
              Strong relational schemas, compound multi-tenant indexes, and TypeORM connection pooling.
            </p>
            <div className="inline-flex items-center text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-md font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Strict Tenant Boundaries
            </div>
          </div>

          {/* Card 3: Cache & Real-time Layer */}
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-lg mb-2">Redis & BullMQ Ready</h3>
            <p className="text-slate-400 text-sm mb-4">
              Distributed coordination, token revocation blacklist, and scheduled background workers.
            </p>
            <div className="inline-flex items-center text-xs text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-md font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Scaffolding Configured
            </div>
          </div>
        </div>

        {/* Phase 1 Completion Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Phase 01: Project Foundation is Complete!</h4>
              <p className="text-slate-400 text-sm mt-1">
                Monorepo workspace, TypeScript configs, Zod environment validation, TypeORM DataSource, and Vite frontend are initialized and verified.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <span className="text-xs text-indigo-400 font-medium">Ready for Phase 02: Auth</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        DEVFLOW Architecture &copy; {new Date().getFullYear()} — Built for Senior Full-Stack Portfolio
      </footer>
    </div>
  );
};

export default App;
