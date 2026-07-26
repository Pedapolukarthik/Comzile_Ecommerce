import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Building, Phone } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="w-6 h-6 text-emerald-400" /> Merchant Profile
        </h1>
        <p className="text-sm text-slate-400 mt-1">View seller account details and platform credentials</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl">
            {user?.firstName ? user.firstName[0] : 'M'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.firstName} {user?.lastName}</h2>
            <p className="text-xs text-emerald-400 font-mono mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-xs text-slate-500 block font-medium">Merchant ID</span>
            <span className="text-slate-200 font-mono">{user?.id || 'usr-seller-001'}</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-xs text-slate-500 block font-medium">Associated Store ID</span>
            <span className="text-emerald-400 font-mono font-semibold">{user?.storeId}</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-xs text-slate-500 block font-medium">Store Name</span>
            <span className="text-white font-semibold">{user?.storeName}</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-xs text-slate-500 block font-medium">Role</span>
            <span className="text-indigo-400 font-semibold">{user?.role || 'SELLER'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
