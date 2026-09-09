import React, { useState } from 'react';
import { ShieldCheck, Phone, ArrowRight, Sparkles, CheckCircle2, Lock, Flame } from 'lucide-react';
import { DEMO_USERS, authenticateUser } from '../services/authService';

export function LoginPage({ onLoginSuccess }) {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = (user) => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess(user);
    }, 400);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const clean = phoneOrEmail.trim();
    if (!clean) {
      setError('Please enter your mobile number or email');
      return;
    }
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 500);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const user = authenticateUser({ identifier: phoneOrEmail, name });
      onLoginSuccess(user);
    }, 500);
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-card-mobile">
        {/* Mobile App Header Badge */}
        <div className="login-brand-header">
          <div className="login-logo-pill">
            <span style={{ fontSize: '24px' }}>💸</span>
            <div className="login-live-pulse" />
          </div>
          <h1 className="login-title">Guilt-Trap</h1>
          <p className="login-subtitle">AI Impulse Spending Tracker</p>
          <div className="login-tagline-chip">
            <Flame size={12} color="#dc2626" />
            <span>Sanju Baba Voice Activated</span>
          </div>
        </div>

        {step === 'input' ? (
          <div>
            {/* Quick 1-Tap Mobile Login for existing users */}
            <div className="login-section-box">
              <span className="login-section-label">⚡ 1-Tap Quick Login (Previous Data Ready)</span>
              <div className="quick-login-grid">
                {DEMO_USERS.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    className="quick-user-btn"
                    onClick={() => handleQuickLogin(u)}
                    disabled={isLoading}
                  >
                    <div className="quick-user-avatar">{u.avatar}</div>
                    <div className="quick-user-details">
                      <div className="quick-user-name">{u.name}</div>
                      <div className="quick-user-meta">{u.phone}</div>
                    </div>
                    <ArrowRight size={16} className="quick-user-arrow" />
                  </button>
                ))}
              </div>
            </div>

            <div className="login-divider">
              <span>or sign in with mobile</span>
            </div>

            {/* Phone/Email Form */}
            <form onSubmit={handleSendOtp} className="login-form">
              {error && <div className="login-error-msg">{error}</div>}

              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input mobile-input"
                  placeholder="e.g. Aaryan"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number / Email</label>
                <div className="mobile-phone-group">
                  <span className="country-code-pill">🇮🇳 +91</span>
                  <input
                    type="text"
                    className="form-input mobile-input phone-field"
                    placeholder="98765 43210"
                    value={phoneOrEmail}
                    onChange={e => setPhoneOrEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-dark mobile-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Get OTP & Continue'} <ArrowRight size={16} />
              </button>
            </form>
          </div>
        ) : (
          /* OTP Screen */
          <form onSubmit={handleVerifyOtp} className="login-form">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                We sent a 4-digit code to <strong style={{ color: '#0f172a' }}>{phoneOrEmail}</strong>
              </div>
              <button
                type="button"
                onClick={() => setStep('input')}
                style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '12px', cursor: 'pointer', marginTop: '4px' }}
              >
                Change Number
              </button>
            </div>

            <div className="otp-input-container">
              {[0, 1, 2, 3].map(idx => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  className="otp-box"
                  value={otp[idx]}
                  onChange={e => {
                    const val = e.target.value;
                    const next = [...otp];
                    next[idx] = val;
                    setOtp(next);
                    if (val && e.target.nextSibling) e.target.nextSibling.focus();
                  }}
                  autoFocus={idx === 0}
                  placeholder="•"
                />
              ))}
            </div>

            <div style={{ textAlign: 'center', margin: '14px 0', fontSize: '12px', color: '#94a3b8' }}>
              Demo auto-code: <strong style={{ color: '#16a34a' }}>4 2 4 2</strong>
            </div>

            <button
              type="button"
              className="btn btn-outline mobile-submit-btn"
              style={{ marginBottom: '8px' }}
              onClick={() => {
                setOtp(['4', '2', '4', '2']);
                setTimeout(() => {
                  const user = authenticateUser({ identifier: phoneOrEmail, name });
                  onLoginSuccess(user);
                }, 300);
              }}
            >
              <Sparkles size={14} /> 1-Tap Auto-Verify OTP
            </button>

            <button
              type="submit"
              className="btn btn-dark mobile-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify & Enter Guilt-Trap'}
            </button>
          </form>
        )}

        {/* Mobile Security Footer */}
        <div className="login-security-footer">
          <div className="security-item">
            <Lock size={12} />
            <span>Persistent Session (No repeated logins)</span>
          </div>
          <div className="security-item">
            <CheckCircle2 size={12} color="#16a34a" />
            <span>Previous Data Automatically Fetched</span>
          </div>
        </div>
      </div>
    </div>
  );
}
