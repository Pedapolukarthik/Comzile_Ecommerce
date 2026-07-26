import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api/v1';

export function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('adminUser') || 'null'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sellers, setSellers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [rejectStoreId, setRejectStoreId] = useState(null);

  useEffect(() => {
    if (token) {
      fetchSellers(filterStatus);
    }
  }, [token, filterStatus]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) {
        setMsg({ type: 'error', text: data.message });
        return;
      }
      setToken(data.data.tokens.accessToken);
      setUser(data.data.user);
      localStorage.setItem('adminToken', data.data.tokens.accessToken);
      localStorage.setItem('adminUser', JSON.stringify(data.data.user));
      setMsg({ type: 'success', text: 'Super Admin logged in successfully' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to connect to API server' });
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  const fetchSellers = async (status = '') => {
    try {
      const url = status ? `${API_BASE}/admin/sellers?status=${status}` : `${API_BASE}/admin/sellers`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSellers(data.data);
      }
    } catch (err) {
      console.error('Error fetching sellers', err);
    }
  };

  const handleApprove = async (storeId) => {
    try {
      const res = await fetch(`${API_BASE}/admin/sellers/${storeId}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Seller Approved successfully! Email & WhatsApp notifications sent.' });
        fetchSellers(filterStatus);
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Approval failed' });
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectStoreId) return;
    try {
      const res = await fetch(`${API_BASE}/admin/sellers/${rejectStoreId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejectionReason: rejectReason }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Seller Rejected. Notification sent.' });
        setRejectStoreId(null);
        setRejectReason('');
        fetchSellers(filterStatus);
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Rejection failed' });
    }
  };

  const handleSuspend = async (storeId) => {
    try {
      const res = await fetch(`${API_BASE}/admin/sellers/${storeId}/suspend`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Seller Suspended successfully.' });
        fetchSellers(filterStatus);
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Action failed' });
    }
  };

  const handleActivate = async (storeId) => {
    try {
      const res = await fetch(`${API_BASE}/admin/sellers/${storeId}/activate`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Seller Activated successfully.' });
        fetchSellers(filterStatus);
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Action failed' });
    }
  };

  if (!token) {
    return (
      <div className="container" style={{ maxWidth: '440px', marginTop: '60px' }}>
        <header style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1>Super Admin Console</h1>
          <p style={{ color: 'var(--text-muted)' }}>Comzilo Multi-Tenant SaaS Platform</p>
        </header>

        {msg.text && (
          <div className="card" style={{ background: msg.type === 'error' ? '#450a0a' : '#064e3b', color: '#fff' }}>
            {msg.text}
          </div>
        )}

        <div className="card">
          <h3>Super Admin Login</h3>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@comzilo.com"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>
            <button
              type="submit"
              style={{ padding: '12px', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Log In as Super Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Super Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Logged in as: {user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{ padding: '8px 16px', background: '#ef4444', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
        >
          Logout
        </button>
      </header>

      {msg.text && (
        <div className="card" style={{ background: msg.type === 'error' ? '#450a0a' : '#064e3b', color: '#fff' }}>
          {msg.text}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3>Seller Onboarding Applications</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['', 'PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '1px solid #334155',
                  background: filterStatus === st ? 'var(--primary)' : '#0f172a',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                {st || 'ALL'}
              </button>
            ))}
          </div>
        </div>

        {sellers.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No seller stores found for this filter.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px' }}>Business Name</th>
                <th style={{ padding: '10px' }}>Owner</th>
                <th style={{ padding: '10px' }}>Mobile</th>
                <th style={{ padding: '10px' }}>Status</th>
                <th style={{ padding: '10px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((s) => {
                const owner = s.storeUsers[0]?.user;
                return (
                  <tr key={s.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '10px' }}>
                      <strong>{s.name}</strong>
                      <br />
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>GST: {s.gstNumber || 'N/A'} | PAN: {s.panNumber || 'N/A'}</span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      {s.ownerName || `${owner?.firstName || ''} ${owner?.lastName || ''}`}
                      <br />
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{owner?.email}</span>
                    </td>
                    <td style={{ padding: '10px' }}>{s.mobileNumber || owner?.mobileNumber || 'N/A'}</td>
                    <td style={{ padding: '10px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          background:
                            s.status === 'ACTIVE'
                              ? '#064e3b'
                              : s.status === 'PENDING'
                              ? '#78350f'
                              : s.status === 'REJECTED'
                              ? '#450a0a'
                              : '#334155',
                          color: '#fff',
                        }}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {s.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(s.id)}
                              style={{ padding: '4px 8px', background: '#10b981', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectStoreId(s.id)}
                              style={{ padding: '4px 8px', background: '#ef4444', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {s.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleSuspend(s.id)}
                            style={{ padding: '4px 8px', background: '#f59e0b', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Suspend
                          </button>
                        )}

                        {(s.status === 'SUSPENDED' || s.status === 'REJECTED') && (
                          <button
                            onClick={() => handleActivate(s.id)}
                            style={{ padding: '4px 8px', background: '#3b82f6', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {rejectStoreId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
            <h3>Reject Seller Application</h3>
            <form onSubmit={handleRejectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Rejection Reason</label>
                <textarea
                  required
                  rows="3"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this seller was rejected..."
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setRejectStoreId(null)}
                  style={{ padding: '8px 12px', background: '#475569', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 12px', background: '#ef4444', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
