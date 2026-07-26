import React, { useState } from 'react';

const API_BASE = 'http://localhost:5000/api/v1';

export function App() {
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [token, setToken] = useState(localStorage.getItem('customerToken') || '');
  const [customerUser, setCustomerUser] = useState(JSON.parse(localStorage.getItem('customerUser') || 'null'));
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Store ID context
  const [storeId, setStoreId] = useState('demo-store-id');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [regData, setRegData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/auth/customer/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': storeId,
        },
        body: JSON.stringify({ ...regData, storeId }),
      });
      const data = await res.json();
      if (!data.success) {
        setMsg({ type: 'error', text: data.message });
        return;
      }
      setToken(data.data.tokens.accessToken);
      setCustomerUser(data.data.user);
      localStorage.setItem('customerToken', data.data.tokens.accessToken);
      localStorage.setItem('customerUser', JSON.stringify(data.data.user));
      setMsg({ type: 'success', text: 'Registered & Logged in successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Registration request failed.' });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_BASE}/auth/customer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-store-id': storeId,
        },
        body: JSON.stringify({ email, password, storeId }),
      });
      const data = await res.json();
      if (!data.success) {
        setMsg({ type: 'error', text: data.message });
        return;
      }
      setToken(data.data.tokens.accessToken);
      setCustomerUser(data.data.user);
      localStorage.setItem('customerToken', data.data.tokens.accessToken);
      localStorage.setItem('customerUser', JSON.stringify(data.data.user));
      setMsg({ type: 'success', text: 'Logged in successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Login request failed.' });
    }
  };

  const handleForgot = async (e) => {
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
    setCustomerUser(null);
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
  };

  if (token && customerUser) {
    return (
      <div className="container">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Customer Storefront</h1>
            <p style={{ color: 'var(--text-muted)' }}>Welcome, {customerUser.firstName}! (Store ID: {customerUser.storeId})</p>
          </div>
          <button
            onClick={handleLogout}
            style={{ padding: '8px 16px', background: '#ef4444', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}
          >
            Logout
          </button>
        </header>

        <div className="card" style={{ background: '#0f172a' }}>
          <h3>Customer Account Active</h3>
          <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>
            Logged in as <strong>{customerUser.email}</strong> under store scope <code>{customerUser.storeId}</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '480px', marginTop: '40px' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Customer Storefront</h1>
        <p style={{ color: 'var(--text-muted)' }}>Multi-Tenant Store Authentication</p>
      </header>

      <div className="card" style={{ marginBottom: '16px', background: '#020617' }}>
        <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Target Store ID Scope *</label>
        <input
          type="text"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          placeholder="Enter Store UUID or Slug"
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#38bdf8' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => { setTab('login'); setMsg({ type: '', text: '' }); }}
          style={{ flex: 1, padding: '10px', background: tab === 'login' ? 'var(--primary)' : '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer' }}
        >
          Customer Login
        </button>
        <button
          onClick={() => { setTab('register'); setMsg({ type: '', text: '' }); }}
          style={{ flex: 1, padding: '10px', background: tab === 'register' ? 'var(--primary)' : '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer' }}
        >
          Register Customer
        </button>
      </div>

      {msg.text && (
        <div
          className="card"
          style={{
            background: msg.type === 'error' ? '#450a0a' : msg.type === 'info' ? '#1e3a8a' : '#064e3b',
            color: '#fff',
            marginBottom: '16px',
          }}
        >
          {msg.text}
        </div>
      )}

      {tab === 'login' && (
        <div className="card">
          <h3>Customer Sign In</h3>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Password</label>
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
              Sign In
            </button>
            <div style={{ textAlign: 'right' }}>
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
          <h3>Register Customer Account</h3>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>First Name *</label>
                <input
                  type="text"
                  required
                  value={regData.firstName}
                  onChange={(e) => setRegData({ ...regData, firstName: e.target.value })}
                  placeholder="Jane"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Last Name</label>
                <input
                  type="text"
                  value={regData.lastName}
                  onChange={(e) => setRegData({ ...regData, lastName: e.target.value })}
                  placeholder="Smith"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Email Address *</label>
              <input
                type="email"
                required
                value={regData.email}
                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                placeholder="jane@example.com"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>Mobile Number</label>
              <input
                type="text"
                value={regData.mobileNumber}
                onChange={(e) => setRegData({ ...regData, mobileNumber: e.target.value })}
                placeholder="9876543210"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
              />
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
            <button
              type="submit"
              style={{ padding: '10px', background: '#10b981', border: 'none', borderRadius: '4px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}
            >
              Create Account
            </button>
          </form>
        </div>
      )}

      {tab === 'forgot' && (
        <div className="card">
          <h3>Reset Customer Password</h3>
          <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Account Email</label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="customer@example.com"
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
