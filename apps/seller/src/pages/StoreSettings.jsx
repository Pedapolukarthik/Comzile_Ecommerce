import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { sellerApi } from '../api/sellerApi';
import { useAuth } from '../context/AuthContext';
import { Store, Globe, Settings, MapPin, Phone, Mail } from 'lucide-react';

export const StoreSettings = () => {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ['sellerProfile'],
    queryFn: () => sellerApi.getProfile(),
  });

  const store = data?.data?.store || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Store Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Multi-Tenant Domain & Store Configuration Scope</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Domain Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" /> Domain & URL Configuration
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Store Name</span>
              <span className="text-white font-medium">{user?.storeName || store?.name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Assigned Store Slug</span>
              <span className="text-emerald-400 font-mono">{store?.slug || 'slug-auto-generated'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Subdomain Scope</span>
              <span className="text-slate-300 font-mono">{store?.subdomain || `${store?.slug || 'store'}.comzilo.com`}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Live Store URL</span>
              <a
                href={store?.storeUrl || `https://${store?.slug}.comzilo.com`}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 font-mono hover:underline text-xs"
              >
                {store?.storeUrl || `https://${store?.slug}.comzilo.com`}
              </a>
            </div>
          </div>
        </div>

        {/* Default Store Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400" /> Auto-Generated Store Defaults
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Base Currency</span>
              <span className="text-slate-200 font-medium">INR (₹)</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Platform Language</span>
              <span className="text-slate-200 font-medium">English (en)</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Timezone</span>
              <span className="text-slate-200 font-medium">Asia/Kolkata (IST)</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Store Theme</span>
              <span className="text-slate-200 font-medium">Default SaaS Modern</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSettings;
