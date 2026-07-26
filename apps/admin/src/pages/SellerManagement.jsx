import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { StatusBadge } from '../components/StatusBadge';
import { Search, CheckCircle, XCircle, Ban, RefreshCw, Eye, AlertCircle } from 'lucide-react';

export const SellerManagement = ({ filterStatus = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectStoreId, setRejectStoreId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [alert, setAlert] = useState({ type: '', text: '' });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['sellers', filterStatus],
    queryFn: () => adminApi.getSellers(filterStatus),
  });

  const sellers = data?.data || [];

  const filteredSellers = sellers.filter((s) => {
    const term = searchTerm.toLowerCase();
    const owner = s.storeUsers?.[0]?.user;
    return (
      s.name?.toLowerCase().includes(term) ||
      s.ownerName?.toLowerCase().includes(term) ||
      owner?.email?.toLowerCase().includes(term) ||
      s.slug?.toLowerCase().includes(term)
    );
  });

  const approveMutation = useMutation({
    mutationFn: (storeId) => adminApi.approveSeller(storeId),
    onSuccess: () => {
      queryClient.invalidateQueries(['sellers']);
      setAlert({ type: 'success', text: 'Seller approved successfully!' });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ storeId, reason }) => adminApi.rejectSeller(storeId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['sellers']);
      setRejectStoreId(null);
      setRejectReason('');
      setAlert({ type: 'success', text: 'Seller application rejected.' });
    },
  });

  const suspendMutation = useMutation({
    mutationFn: (storeId) => adminApi.suspendSeller(storeId),
    onSuccess: () => {
      queryClient.invalidateQueries(['sellers']);
      setAlert({ type: 'success', text: 'Seller account suspended.' });
    },
  });

  const activateMutation = useMutation({
    mutationFn: (storeId) => adminApi.activateSeller(storeId),
    onSuccess: () => {
      queryClient.invalidateQueries(['sellers']);
      setAlert({ type: 'success', text: 'Seller account activated.' });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Seller Management</h1>
          <p className="text-sm text-slate-400 mt-1">Review onboarding applications and manage seller accounts</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search business, email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {alert.text && (
        <div className={`p-4 rounded-xl text-sm flex items-center justify-between ${alert.type === 'success' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950/60 text-rose-300 border border-rose-800/50'}`}>
          <span>{alert.text}</span>
          <button onClick={() => setAlert({ type: '', text: '' })} className="text-xs opacity-60 hover:opacity-100">Dismiss</button>
        </div>
      )}

      {/* Sellers List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading sellers list...</div>
        ) : filteredSellers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No sellers found for this view.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs font-semibold uppercase text-slate-400 bg-slate-950/50 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Business Name & URL</th>
                  <th className="py-3.5 px-4">Owner Contact</th>
                  <th className="py-3.5 px-4">GST / PAN</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSellers.map((seller) => {
                  const owner = seller.storeUsers?.[0]?.user;
                  return (
                    <tr key={seller.id} className="hover:bg-slate-800/30">
                      <td className="py-4 px-4 font-medium text-white">
                        <Link to={`/sellers/${seller.id}`} className="hover:text-indigo-400 transition-colors">
                          {seller.name}
                        </Link>
                        <span className="block text-xs text-slate-500 font-normal">
                          {seller.storeUrl || `${seller.slug}.comzilo.com`}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-200 block font-medium">{seller.ownerName || `${owner?.firstName || ''} ${owner?.lastName || ''}`}</span>
                        <span className="text-xs text-slate-400 block">{owner?.email}</span>
                        <span className="text-xs text-slate-500 block">{seller.mobileNumber || owner?.mobileNumber || 'N/A'}</span>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-400">
                        <div>GST: <span className="text-slate-300">{seller.gstNumber || 'N/A'}</span></div>
                        <div>PAN: <span className="text-slate-300">{seller.panNumber || 'N/A'}</span></div>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={seller.status} />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/sellers/${seller.id}`}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {seller.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => approveMutation.mutate(seller.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => setRejectStoreId(seller.id)}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Reject
                              </button>
                            </>
                          )}

                          {seller.status === 'ACTIVE' && (
                            <button
                              onClick={() => suspendMutation.mutate(seller.id)}
                              className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <Ban className="w-3.5 h-3.5" /> Suspend
                            </button>
                          )}

                          {(seller.status === 'SUSPENDED' || seller.status === 'REJECTED') && (
                            <button
                              onClick={() => activateMutation.mutate(seller.id)}
                              className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectStoreId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Reject Seller Application</h3>
            <p className="text-xs text-slate-400 mb-4">Provide a reason for rejecting this seller application. This reason will be communicated to the seller.</p>
            <textarea
              required
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Incomplete GST documentation..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRejectStoreId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => rejectMutation.mutate({ storeId: rejectStoreId, reason: rejectReason })}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerManagement;
