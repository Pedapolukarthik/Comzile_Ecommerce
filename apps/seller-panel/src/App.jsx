import React, { useState } from 'react';

const API_BASE = 'http://localhost:5000/api/v1';

export function App() {
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [token, setToken] = useState(localStorage.getItem('sellerToken') || '');
  const [sellerUser, setSellerUser] = useState(JSON.parse(localStorage.getItem('sellerUser') || 'null'));
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regData, setRegData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    gstNumber: '',
    panNumber: '',
    address: '',
  });

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/auth/seller/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData),
      });
      const data = await res.json();
      if (!data.success) {
        setMsg({ type: 'error', text: data.message });
        return;
      }
      setMsg({
        type: 'warning',
        text: 'Registration successful! Status = PENDING. Your store application must be approved by Super Admin before you can log in.',
      });
      setTab('login');
      setLoginEmail(regData.email);
    } catch (err) {
      setMsg({ type: 'error', text: 'Registration request failed. Check server connection.' });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/auth/seller/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!data.success) {
        setMsg({ type: 'error', text: data.message });
        return;
      }
      setToken(data.data.tokens.accessToken);
      setSellerUser(data.data.user);
      localStorage.setItem('sellerToken', data.data.tokens.accessToken);
      localStorage.setItem('sellerUser', JSON.stringify(data.data.user));
      setMsg({ type: 'success', text: 'Logged in successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Login request failed. Check server connection.' });
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setMsg({ type: 'info', text: data.message });
    } catch (err) {
      setMsg({ type: 'error', text: 'Request failed.' });
    }
  };

  const handleLogout = () => {
    setToken('');
    setSellerUser(null);
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerUser');
  };

  if (token && sellerUser) {
    return (
      <div className="container">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Seller Control Center</h1>
            <p style={{ color: 'var(--text-muted)' }}>Store: <strong>{sellerUser.storeName}</strong> ({sellerUser.email})</p>
          </div>
          <button
            onClick={handleLogout}
            style={{ padding: '8px 16px', background: '#ef4444', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
          >
            Logout
          </button>
        </header>

        <div className="card" style={{ background: '#064e3b', color: '#fff' }}>
          <h3>Account Status: ACTIVE</h3>
          <p style={{ marginTop: '8px' }}>Your seller account is approved and active on the Comzilo SaaS Platform.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '520px', marginTop: '40px' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Comzilo Seller Panel</h1>
        <p style={{ color: 'var(--text-muted)' }}>Multi-Tenant Seller Onboarding & Authentication</p>
      </header>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => { setTab('login'); setMsg({ type: '', text: '' }); }}
          style={{ flex: 1, padding: '10px', background: tab === 'login' ? 'var(--primary)' : '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer' }}
        >
          Seller Login
        </button>
        <button
          onClick={() => { setTab('register'); setMsg({ type: '', text: '' }); }}
          style={{ flex: 1, padding: '10px', background: tab === 'register' ? 'var(--primary)' : '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer' }}
        >
          Register Seller
        </button>
      </div>

      {msg.text && (
        <div
          className="card"
          style={{
            background: msg.type === 'error' ? '#450a0a' : msg.type === 'warning' ? '#78350f' : '#064e3b',
            color: '#fff',
            marginBottom: '16px',
          }}
        >
          {msg.text}
        </div>
      )}

      {tab === 'login' && (
        <div className="card">
          <h3>Seller Login</h3>
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Email Address</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="seller@business.com"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>
            <button
              type="submit"
              style={{ padding: '12px', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Log In to Seller Panel
            </button>
            <div style={{ textAlign: 'right', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setTab('forgot')}
                style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '12px', cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      )}

      {tab === 'register' && (
        <div className="card">
          <h3>Register New Seller Account</h3>
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Business Name *</label>
              <input
                type="text"
                required
                value={regData.businessName}
                onChange={(e) => setRegData({ ...regData, businessName: e.target.value })}
                placeholder="Apex Traders"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Owner Name *</label>
              <input
                type="text"
                required
                value={regData.ownerName}
                onChange={(e) => setRegData({ ...regData, ownerName: e.target.value })}
                placeholder="John Doe"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Email *</label>
                <input
                  type="email"
                  required
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  placeholder="owner@apex.com"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Mobile Number *</label>
                <input
                  type="text"
                  required
                  value={regData.mobileNumber}
                  onChange={(e) => setRegData({ ...regData, mobileNumber: e.target.value })}
                  placeholder="9876543210"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Password *</label>
                <input
                  type="password"
                  required
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  placeholder="Pass@1234"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={regData.confirmPassword}
                  onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                  placeholder="Pass@1234"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>GST Number (Optional)</label>
                <input
                  type="text"
                  value={regData.gstNumber}
                  onChange={(e) => setRegData({ ...regData, gstNumber: e.target.value })}
                  placeholder="22AAAAA0000A1Z5"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>PAN Number (Optional)</label>
                <input
                  type="text"
                  value={regData.panNumber}
                  onChange={(e) => setRegData({ ...regData, panNumber: e.target.value })}
                  placeholder="ABCDE1234F"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Business Address *</label>
              <textarea
                required
                rows="2"
                value={regData.address}
                onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                placeholder="123 Business Street, Tech Park..."
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>
            <button
              type="submit"
              style={{ padding: '10px', background: '#10b981', border: 'none', borderRadius: '4px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}
            >
              Submit Seller Application
            </button>
          </form>
        </div>
      )}

      {tab === 'forgot' && (
        <div className="card">
          <h3>Reset Seller Password</h3>
          <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Registered Email</label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="seller@business.com"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>
            <button
              type="submit"
              style={{ padding: '10px', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Send Reset Token
            </button>
            <button
              type="button"
              onClick={() => setTab('login')}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}
            >
              Back to Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
