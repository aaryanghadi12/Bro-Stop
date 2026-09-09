import React from 'react';
import { X, Volume2, TrendingUp, Flame } from 'lucide-react';
import { getMemeForCategory } from '../data/memeTemplates';
import { calculateSIPOpportunity } from '../services/roastEngine';
import { speakSanjuDutt } from '../services/voiceService';

export function RoastModal({ expense, onClose, onCancelExpense }) {
  if (!expense) return null;

  const meme = getMemeForCategory(expense.category, expense.tier);
  const sip = calculateSIPOpportunity(expense.amount, 10);

  const handleSpeak = () => {
    speakSanjuDutt(expense.roastText);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ background: '#fef2f2' }}>
          <div className="modal-header-title">
            <span style={{ fontSize: '18px' }}>🚨</span>
            <div>
              <div style={{ color: '#dc2626' }}>Guilt-Trap Intervention</div>
              <div style={{ fontSize: '11px', fontWeight: 500, color: '#737373' }}>
                Score: {expense.impulseScore}/100 · {expense.severityLabel}
              </div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body">
          {/* Meme */}
          <div className="meme-container">
            <div className="meme-top-text">{meme.topText}</div>
            <div className="meme-emoji">{meme.emoji}</div>
            <div className="meme-character">{meme.character}</div>
            <div className="meme-bottom-text">{meme.bottomText}</div>
          </div>

          {/* Roast */}
          <div className="roast-box">
            <div className="roast-box-header">
              <span className="roast-box-label"><Flame size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> AI Commentary</span>
              <button className="btn btn-ghost btn-sm" onClick={handleSpeak} style={{ padding: '2px 8px', fontSize: '11px', color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Volume2 size={13} /> 🎙️ Sanju Baba Voice
              </button>
            </div>
            <p className="roast-box-text">"{expense.roastText}"</p>
          </div>

          {/* SIP */}
          <div className="sip-box">
            <TrendingUp size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '12px' }}>10-Year Opportunity Cost:</strong>{' '}
              <span style={{ fontSize: '12px', color: '#525252' }}>
                ₹{expense.amount} invested at 12% CAGR = <strong style={{ color: '#16a34a' }}>₹{sip.futureValue.toLocaleString('en-IN')}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-danger" onClick={() => { onCancelExpense?.(expense.id); onClose(); }}>
            Cancel & Save 🛡️
          </button>
          <button className="btn btn-dark" onClick={onClose}>
            Accept Guilt 💸
          </button>
        </div>
      </div>
    </div>
  );
}
