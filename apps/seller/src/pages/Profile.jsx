import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { sellerApi } from '../api/sellerApi';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, CheckCircle } from 'lucide-react';

export const Profile = () => {
  const { user: authUser } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['sellerProfile'],
    queryFn: () => sellerApi.getProfile(),
  });

  const profile = data?.data?.user || authUser;
  const storeId = data?.data?.storeId || authUser?.storeId;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Merchant Profile</h1>
        <p className="text-sm text-slate-400 mt-1">Verified User Context & Platform Roles</p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-500 text-sm">Loading user context...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 max-w-2xl">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-2xl">
              {profile?.firstName?.[0] || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{profile?.firstName} {profile?.lastName}</h2>
              <p className="text-xs text-emerald-400 font-mono mt-0.5">{profile?.email}</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">User ID</span>
              <span className="text-slate-300 font-mono text-xs">{profile?.id || profile?.userId}</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Account Role</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-950/60 text-indigo-400 border border-indigo-800/50 mt-1">
                <Shield className="w-3.5 h-3.5" /> SELLER
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Associated Store ID</span>
              <span className="text-emerald-400 font-mono text-xs block mt-1">{storeId}</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Authentication State</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 mt-1">
                <CheckCircle className="w-3.5 h-3.5" /> JWT Verified Session
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
