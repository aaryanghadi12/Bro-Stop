import React, { useState } from 'react';
import { X, Key, User, RotateCcw, Download, Save, Volume2 } from 'lucide-react';
import { speakSanjuDutt } from '../services/voiceService';

export function SettingsModal({ user, onLogout, settings, onSaveSettings, onResetDemo, onExportData, onClose }) {
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');
  const [budget, setBudget] = useState(settings.monthlyBudget || 25000);
  const [name, setName] = useState(settings.userName || 'Aaryan');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings({ geminiApiKey: apiKey.trim(), monthlyBudget: Number(budget), userName: name.trim() || 'Aaryan', audioEnabled: true });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">⚙️ Settings</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Gemini API Key (optional)</label>
              <input type="password" className="form-input" placeholder="AIzaSy..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
              <span className="form-hint">Leave empty — built-in roast engine works offline</span>
            </div>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Monthly Budget (₹)</label>
              <div className="form-input-with-prefix">
                <span className="form-prefix">₹</span>
                <input type="number" className="form-input" value={budget} onChange={e => setBudget(e.target.value)} />
              </div>
            </div>

            <div className="form-group" style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>🎙️ Voice Accent</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Sanjay Dutt (Munna Bhai / Tapori baritone)</div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '11px', color: '#dc2626', borderColor: '#fca5a5' }}
                  onClick={() => speakSanjuDutt('Aey Bhai! Bole toh tension lene ka nahi, dene ka! Par yeh faltu kharcha dekh ke apun ka khopdi ghoom gaya re baba!')}
                >
                  <Volume2 size={12} /> Test Sanju Baba Voice
                </button>
              </div>
            </div>

            {user && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Logged in as {user.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{user.phone || user.email}</div>
                </div>
                {onLogout && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ color: '#dc2626', borderColor: '#fca5a5', fontSize: '11px' }}
                    onClick={() => { onClose(); onLogout(); }}
                  >
                    Log out
                  </button>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #e5e5e5', paddingTop: '14px' }}>
              <button type="button" className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={onResetDemo}>
                <RotateCcw size={13} /> Reset Demo
              </button>
              <button type="button" className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={onExportData}>
                <Download size={13} /> Export JSON
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-dark"><Save size={14} /> Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
