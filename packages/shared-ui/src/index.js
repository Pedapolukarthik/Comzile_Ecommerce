const React = require('react');

const Button = ({ children, variant = 'primary', onClick, className = '', ...props }) => {
  const baseStyle = {
    padding: '10px 18px',
    borderRadius: '6px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const variants = {
    primary: {
      backgroundColor: '#4f46e5',
      color: '#ffffff'
    },
    secondary: {
      backgroundColor: '#0f172a',
      color: '#ffffff'
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid #cbd5e1',
      color: '#334155'
    }
  };

  return React.createElement(
    'button',
    {
      style: { ...baseStyle, ...variants[variant] },
      onClick,
      className,
      ...props
    },
    children
  );
};

const Badge = ({ children, color = 'blue' }) => {
  const badgeStyle = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    backgroundColor: color === 'green' ? '#dcfce7' : color === 'purple' ? '#f3e8ff' : '#dbeafe',
    color: color === 'green' ? '#15803d' : color === 'purple' ? '#7e22ce' : '#1d4ed8'
  };

  return React.createElement('span', { style: badgeStyle }, children);
};

module.exports = { Button, Badge };
