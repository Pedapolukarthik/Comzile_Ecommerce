import React from 'react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© 2026 Comzilo Multi-Tenant SaaS Platform. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
