import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Store, User, Settings, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Hero Card */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-3xl p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" /> Seller Account Approved & Active
          </div>
          <h1 className="text-3xl font-extrabold text-white">Welcome back, {user?.firstName || 'Seller'}!</h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Your store <strong className="text-emerald-400">{user?.storeName}</strong> is active on the Comzilo SaaS Multi-Tenant Platform.
          </p>
          {user?.storeId && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
                Store Scope ID: <span className="text-emerald-400">{user.storeId}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/profile"
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <User className="w-6 h-6" />
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">User Profile</h3>
          <p className="text-xs text-slate-400 mt-1">Manage your merchant account details and authentication roles.</p>
        </Link>

        <Link
          to="/settings"
          className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Settings className="w-6 h-6" />
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Store Settings</h3>
          <p className="text-xs text-slate-400 mt-1">View your assigned store domains, currency, and configuration defaults.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
