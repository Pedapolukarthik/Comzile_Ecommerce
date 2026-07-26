import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { StatusBadge } from '../components/StatusBadge';
import {
  ArrowLeft,
  Building,
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  Globe,
  CheckCircle,
  XCircle,
  Ban,
  RefreshCw,
  Clock,
} from 'lucide-react';

export const SellerDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['sellers'],
    queryFn: () => adminApi.getSellers(''),
  });

  const sellers = data?.data || [];
  const seller = sellers.find((s) => s.id === id);

  const approveMutation = useMutation({
    mutationFn: () => adminApi.approveSeller(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['sellers']);
      setMsg({ type: 'success', text: 'Seller approved successfully!' });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => adminApi.rejectSeller(id, rejectReason),
    onSuccess: () => {
      queryClient.invalidateQueries(['sellers']);
      setShowRejectModal(false);
      setMsg({ type: 'success', text: 'Seller application rejected.' });
    },
  });

  const suspendMutation = useMutation({
    mutationFn: () => adminApi.suspendSeller(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['sellers']);
      setMsg({ type: 'success', text: 'Seller account suspended.' });
    },
  });

  const activateMutation = useMutation({
    mutationFn: () => adminApi.activateSeller(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['sellers']);
      setMsg({ type: 'success', text: 'Seller account activated.' });
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 text-sm">Loading seller details...</div>;
  }

  if (!seller) {
    return (
      <div className="space-y-4">
        <Link to="/sellers" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Sellers
        </Link>
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-400">
          Seller store record not found.
        </div>
      </div>
    );
  }

  const owner = seller.storeUsers?.[0]?.user;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/sellers" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Sellers Directory
        </Link>
        <StatusBadge status={seller.status} />
      </div>

      {msg.text && (
        <div className={`p-4 rounded-xl text-sm ${msg.type === 'success' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950/60 text-rose-300 border border-rose-800/50'}`}>
          {msg.text}
        </div>
      )}

      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{seller.name}</h1>
          <p className="text-xs text-indigo-400 font-mono mt-1">{seller.storeUrl || `https://${seller.slug}.comzilo.com`}</p>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Registered: {new Date(seller.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {seller.status === 'PENDING' && (
            <>
              <button
                onClick={() => approveMutation.mutate()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Approve Application
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <XCircle className="w-4 h-4" /> Reject Application
              </button>
            </>
          )}

          {seller.status === 'ACTIVE' && (
            <button
              onClick={() => suspendMutation.mutate()}
              className="px-4 py-2.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Ban className="w-4 h-4" /> Suspend Seller
            </button>
          )}

          {(seller.status === 'SUSPENDED' || seller.status === 'REJECTED') && (
            <button
              onClick={() => activateMutation.mutate()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Activate Seller
            </button>
          )}
        </div>
      </div>

      {seller.status === 'REJECTED' && seller.rejectionReason && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/50 rounded-xl text-xs text-rose-300">
          <strong>Rejection Reason:</strong> {seller.rejectionReason}
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Information */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" /> Business Details
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Business Name</span>
              <span className="text-white font-medium">{seller.name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Store Slug</span>
              <span className="text-slate-300 font-mono">{seller.slug}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Subdomain</span>
              <span className="text-slate-300 font-mono">{seller.subdomain || seller.slug}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <span className="text-xs text-slate-500 block">GST Number</span>
                <span className="text-slate-200 font-mono">{seller.gstNumber || 'Not Provided'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">PAN Number</span>
                <span className="text-slate-200 font-mono">{seller.panNumber || 'Not Provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Owner Information */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" /> Owner Contact Info
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Owner Full Name</span>
              <span className="text-white font-medium">{seller.ownerName || `${owner?.firstName || ''} ${owner?.lastName || ''}`}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Email Address</span>
              <span className="text-slate-300 font-mono flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> {owner?.email}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Mobile Number</span>
              <span className="text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" /> {seller.mobileNumber || owner?.mobileNumber || 'N/A'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-500 block">Business Address</span>
              <span className="text-slate-300 flex items-start gap-1.5 mt-0.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                {seller.address || 'Address not specified'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Reject Application</h3>
            <textarea
              required
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="State reason for rejection..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-sm font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => rejectMutation.mutate()}
                className="px-4 py-2 bg-rose-600 text-white text-sm font-semibold rounded-xl"
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

export default SellerDetails;
