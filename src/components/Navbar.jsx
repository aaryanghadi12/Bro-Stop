import React from 'react';
import { Mail, LayoutDashboard, History, Settings, RefreshCw } from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, guiltScore, onOpenSettings, onResetDemo }) {
  const getGuiltStatus = (score) => {
    if (score >= 75) return { label: 'Critical', color: 'var(--danger)' };
    if (score >= 50) return { label: 'FOMO Zone', color: 'var(--orange)' };
    if (score >= 25) return { label: 'Mild', color: 'var(--warning)' };
    return { label: 'Stable', color: 'var(--success)' };
  };

  const status = getGuiltStatus(guiltScore);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="nav-logo-icon">💸</div>
        <div>
          <div className="nav-brand-title">
            Guilt-Trap
            <span style={{
              fontSize: '10px',
              background: 'var(--accent-soft)',
              color: 'var(--accent)',
              padding: '2px 7px',
              borderRadius: '6px',
              border: '1px solid var(--accent-border)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500
            }}>
              AI
            </span>
          </div>
          <div className="nav-brand-subtitle">Your financial conscience</div>
        </div>
      </div>

      <div className="nav-actions">
        <div
          className="guilt-meter-pill"
          style={{
            borderColor: status.color,
            background: `color-mix(in srgb, ${status.color} 10%, transparent)`,
            color: status.color,
            border: `1px solid color-mix(in srgb, ${status.color} 30%, transparent)`,
          }}
        >
          <span
            className="pulse-dot"
            style={{ background: status.color }}
          />
          <span>{guiltScore}/100 · {status.label}</span>
        </div>

        <div className="nav-tab-group">
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={14} />
            Dashboard
          </button>
          <button
            className={`nav-tab ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            <History size={14} />
            Feed
          </button>
          <button
            className={`nav-tab ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
          >
            <Mail size={14} />
            Report
          </button>
        </div>

        <button className="btn btn-ghost btn-sm" onClick={onResetDemo} title="Reset demo data">
          <RefreshCw size={14} />
        </button>
        <button className="btn btn-secondary btn-sm" onClick={onOpenSettings} title="Settings">
          <Settings size={14} />
        </button>
      </div>
    </nav>
  );
}
