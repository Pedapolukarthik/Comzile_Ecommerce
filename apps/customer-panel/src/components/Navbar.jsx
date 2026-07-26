import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Search, User, LogOut, Store, Compass, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-emerald-600 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-emerald-600/20">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight leading-none block">Comzilo Store</span>
            <span className="text-[10px] text-emerald-400 font-medium tracking-wide uppercase">SaaS Storefront</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                isActive ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                isActive ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            Product Catalog
          </NavLink>
        </nav>

        {/* User Context & Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/catalog')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title="Search Catalog"
          >
            <Search className="w-5 h-5" />
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <div className="hidden sm:block text-right">
                <span className="text-xs font-semibold text-white block">{user?.firstName || 'Customer'} {user?.lastName || ''}</span>
                <span className="text-[10px] text-emerald-400 font-mono block">{user?.email}</span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
