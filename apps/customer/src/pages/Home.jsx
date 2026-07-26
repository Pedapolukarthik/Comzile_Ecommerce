import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Shield, Store, CheckCircle, ArrowRight, User } from 'lucide-react';

export const Home = () => {
  const { user, storeId, isAuthenticated } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-3xl p-10 relative overflow-hidden text-center md:text-left">
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold">
            <Store className="w-3.5 h-3.5" /> Multi-Tenant Storefront Active Scope
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Welcome to <span className="text-indigo-400 font-mono">{storeId}</span> Storefront
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Experience multi-tenant SaaS eCommerce powered by enterprise authentication and tenant resolution.
          </p>

          {isAuthenticated ? (
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center gap-3 text-left inline-flex">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 font-medium">Logged in as:</p>
                <p className="text-sm font-semibold text-white">{user?.firstName} {user?.lastName} ({user?.email})</p>
              </div>
            </div>
          ) : (
            <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                to="/login"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2"
              >
                Sign In to Customer Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors border border-slate-700"
              >
                Register New Customer
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Store Scope Binding</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every customer account is strictly bound to the target <code className="text-indigo-400">{storeId}</code> store scope via tenant headers.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Enterprise Security</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Protected by bcrypt password hashing, Zod validation, JWT authentication, and token rotation safeguards.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Customer Profile</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Seamless login & registration experience with automatic session storage in localStorage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
