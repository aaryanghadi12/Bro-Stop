import React from 'react';
import { LayoutDashboard, History, Mail, Settings, RefreshCw, TrendingDown, Moon, Volume2 } from 'lucide-react';
import { speakSanjuDutt } from '../services/voiceService';

export function Sidebar({ activeTab, setActiveTab, guiltScore, expenses, onOpenSettings, onResetDemo }) {
  const getScoreColor = (s) => {
    if (s >= 75) return { color: '#dc2626', bg: '#dc2626', label: 'Critical' };
    if (s >= 50) return { color: '#d97706', bg: '#d97706', label: 'At Risk' };
    if (s >= 25) return { color: '#f59e0b', bg: '#f59e0b', label: 'Watch Out' };
    return { color: '#16a34a', bg: '#16a34a', label: 'Healthy' };
  };

  const status = getScoreColor(guiltScore);
  const savageCount = expenses.filter(e => e.tier === 'SAVAGE').length;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-logo">💸</div>
          <div>
            <div className="sidebar-title">Guilt-Trap</div>
            <div className="sidebar-subtitle">Impulse spending tracker</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Overview</div>

        <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <LayoutDashboard size={16} />
          Dashboard
        </button>

        <button className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`} onClick={() => setActiveTab('feed')}>
          <History size={16} />
          Transactions
          {savageCount > 0 && <span className="nav-item-badge">{savageCount}</span>}
        </button>

        <button className={`nav-item ${activeTab === 'email' ? 'active' : ''}`} onClick={() => setActiveTab('email')}>
          <Mail size={16} />
          Weekly Report
        </button>

        {/* Guilt Score Widget */}
        <div className="sidebar-guilt-box">
          <div className="guilt-score-row">
            <span className="guilt-score-label">Guilt Index</span>
            <span className="guilt-score-value" style={{ color: status.color }}>{guiltScore}</span>
          </div>
          <div className="guilt-bar-track">
            <div className="guilt-bar-fill" style={{ width: `${guiltScore}%`, backgroundColor: status.bg }} />
          </div>
          <span className="guilt-status-text" style={{ color: status.color }}>{status.label}</span>
        </div>
        {/* Voice Badge */}
        <div style={{ marginTop: '14px', padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>🎙️ Voice Persona</span>
            <button
              onClick={() => speakSanjuDutt('Aey Bhai! Bole toh tension lene ka nahi, dene ka!')}
              title="Test Sanju Baba voice"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '2px', display: 'flex', alignItems: 'center' }}
            >
              <Volume2 size={13} />
            </button>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Sanjay Dutt (Munna Bhai)</div>
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-footer-btn" onClick={onResetDemo}>
          <RefreshCw size={13} /> Reset
        </button>
        <button className="sidebar-footer-btn" onClick={onOpenSettings}>
          <Settings size={13} /> Settings
        </button>
      </div>
    </aside>
  );
}
