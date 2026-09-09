import React from 'react';
import { Settings, LogOut, Volume2, ShieldAlert } from 'lucide-react';
import { speakSanjuDutt } from '../services/voiceService';

export function MobileHeader({ user, guiltScore, onOpenSettings, onLogout }) {
  const getScoreBadge = (s) => {
    if (s >= 75) return { bg: '#fee2e2', text: '#dc2626', label: 'Critical' };
    if (s >= 50) return { bg: '#fef3c7', text: '#d97706', label: 'At Risk' };
    if (s >= 25) return { bg: '#fef9c3', text: '#ca8a04', label: 'Watch Out' };
    return { bg: '#dcfce7', text: '#16a34a', label: 'Healthy' };
  };

  const badge = getScoreBadge(guiltScore);

  return (
    <header className="mobile-app-header">
      <div className="mobile-header-left">
        <div className="mobile-avatar">{user?.avatar || '👤'}</div>
        <div className="mobile-user-info">
          <div className="mobile-user-greeting">Hey, {user?.name?.split(' ')[0] || 'Aaryan'}</div>
          <div className="mobile-guilt-pill" style={{ background: badge.bg, color: badge.text }}>
            <span>Guilt Index: {guiltScore}</span>
            <span className="dot">•</span>
            <span>{badge.label}</span>
          </div>
        </div>
      </div>

      <div className="mobile-header-actions">
        <button
          className="mobile-icon-btn voice"
          onClick={() => speakSanjuDutt('Aey Bhai! Bole toh tension lene ka nahi, dene ka!')}
          title="Sanju Baba Voice"
        >
          <Volume2 size={16} color="#dc2626" />
        </button>

        <button
          className="mobile-icon-btn"
          onClick={onOpenSettings}
          title="Settings"
        >
          <Settings size={16} />
        </button>

        <button
          className="mobile-icon-btn logout"
          onClick={onLogout}
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
