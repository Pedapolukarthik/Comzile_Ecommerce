import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { StatusBadge } from '../components/StatusBadge';
import { Users, Clock, CheckCircle, XCircle, ArrowRight, Store } from 'lucide-react';

export const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sellers'],
    queryFn: () => adminApi.getSellers(''),
  });

  const sellers = data?.data || [];
  const pendingCount = sellers.filter((s) => s.status === 'PENDING').length;
  const approvedCount = sellers.filter((s) => s.status === 'ACTIVE').length;
  const rejectedCount = sellers.filter((s) => s.status === 'REJECTED').length;

  const statCards = [
    { title: 'Total Registered Sellers', value: sellers.length, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { title: 'Pending Approval', value: pendingCount, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', link: '/sellers/pending' },
    { title: 'Approved Active Sellers', value: approvedCount, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', link: '/sellers/approved' },
    { title: 'Rejected Applications', value: rejectedCount, icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10', link: '/sellers/rejected' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Super Admin Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Multi-Tenant Platform Overview & Onboarding Controls</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</span>
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">{isLoading ? '...' : stat.value}</span>
                {stat.link && (
                  <Link to={stat.link} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                    View list <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Applications Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Recent Seller Applications</h2>
          </div>
          <Link to="/sellers" className="text-xs text-indigo-400 hover:underline font-medium">
            View All Sellers
          </Link>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading seller data...</div>
        ) : sellers.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">No seller applications registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs font-semibold uppercase text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="pb-3 px-3">Business Name</th>
                  <th className="pb-3 px-3">Owner Details</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sellers.slice(0, 5).map((seller) => {
                  const owner = seller.storeUsers?.[0]?.user;
                  return (
                    <tr key={seller.id} className="hover:bg-slate-800/30">
                      <td className="py-4 px-3 font-medium text-white">
                        {seller.name}
                        <span className="block text-xs text-slate-500 font-normal">
                          {seller.subdomain ? `${seller.subdomain}.comzilo.com` : seller.slug}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <span className="text-slate-200">{seller.ownerName || `${owner?.firstName || ''} ${owner?.lastName || ''}`}</span>
                        <span className="block text-xs text-slate-500">{owner?.email}</span>
                      </td>
                      <td className="py-4 px-3">
                        <StatusBadge status={seller.status} />
                      </td>
                      <td className="py-4 px-3 text-xs text-slate-500">
                        {new Date(seller.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-3 text-right">
                        <Link
                          to={`/sellers/${seller.id}`}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
