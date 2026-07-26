import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerApi } from '../api/customerApi';
import { Store, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export const CustomerLogin = () => {
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('Pass@1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      const res = await customerApi.login({ email, password, storeId: 'demo-store-id' });
      if (res.success) {
        login(res.data.user, res.data.tokens.accessToken);
        navigate('/');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex flex-col items-center mb-4 text-center">
          <div className="p-3 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl mb-3">
            <Store className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Customer Log In</h1>
          <p className="text-xs text-slate-400 mt-1">Access your customer account and orders</p>
        </div>

        {error && (
          <div className="p-4 bg-rose-950/60 border border-rose-800/50 rounded-xl flex items-center gap-3 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In'}
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400">New customer? </span>
            <Link to="/register" className="text-xs font-semibold text-emerald-400 hover:underline">
              Create an Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
