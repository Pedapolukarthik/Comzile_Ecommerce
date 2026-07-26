import React from 'react';

export const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: 'bg-amber-950/60 text-amber-400 border-amber-800/50',
    ACTIVE: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
    SUSPENDED: 'bg-orange-950/60 text-orange-400 border-orange-800/50',
    REJECTED: 'bg-rose-950/60 text-rose-400 border-rose-800/50',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[status] || 'bg-slate-800 text-slate-300 border-slate-700'
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
