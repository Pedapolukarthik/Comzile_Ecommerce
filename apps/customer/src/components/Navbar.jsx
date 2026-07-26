import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, User, LogOut, Store, Search } from 'lucide-react';

export const Navbar = () => {
  const { user, storeId, setStoreId, isAuthenticated, logout } = useAuth();
  const [editingStore, setEditingStore] = useState(false);
  const [inputStoreId, setInputStoreId] = useState(storeId);
  const navigate = useNavigate();

  const handleStoreSubmit = (e) => {
    e.preventDefault();
    if (inputStoreId.trim()) {
      setStoreId(inputStoreId.trim());
      setEditingStore(false);
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Store Scope */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Comzilo Storefront</span>
          </Link>

          {/* Store Scope Badge / Switcher */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <Store className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 font-medium">Store Scope:</span>
            {editingStore ? (
              <form onSubmit={handleStoreSubmit} className="flex items-center gap-1">
                <input
                  type="text"
                  value={inputStoreId}
                  onChange={(e) => setInputStoreId(e.target.value)}
                  className="bg-slate-900 px-2 py-0.5 border border-indigo-500/50 rounded text-indigo-300 font-mono text-xs focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-950/60 rounded">Save</button>
              </form>
            ) : (
              <button
                onClick={() => setEditingStore(true)}
                title="Click to switch target Store ID"
                className="text-indigo-400 font-mono font-semibold hover:underline"
              >
                {storeId}
              </button>
            )}
          </div>
        </div>

        {/* User Account Controls */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-200">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-slate-400 font-mono">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-colors"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
