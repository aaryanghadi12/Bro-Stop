import React, { useState } from 'react';
import { Volume2, Trash2, Moon } from 'lucide-react';
import { CATEGORIES } from '../services/impulseEngine';
import { speakSanjuDutt } from '../services/voiceService';

export function RoastFeed({ expenses = [], onDeleteExpense }) {
  const [filter, setFilter] = useState('all');

  const filtered = expenses.filter(e => {
    if (filter === 'savage') return e.tier === 'SAVAGE';
    if (filter === 'midnight') return e.isMidnightDemonic;
    if (filter === 'safe') return e.tier === 'SAFE';
    return true;
  });

  const speak = (text) => {
    speakSanjuDutt(text);
  };

  const fmtTime = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return 'Recently'; }
  };

  const tierClass = (t) => {
    if (t === 'SAVAGE') return 'red';
    if (t === 'MEDIUM') return 'orange';
    if (t === 'MILD') return 'amber';
    return 'green';
  };

  const tierTag = (t) => {
    if (t === 'SAVAGE') return 'tag-red';
    if (t === 'MEDIUM') return 'tag-orange';
    if (t === 'MILD') return 'tag-amber';
    return 'tag-green';
  };

  return (
    <div className="card">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 className="card-title">Transaction History</h3>
        </div>
        <div className="filter-tabs">
          <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All ({expenses.length})</button>
          <button className={`filter-tab ${filter === 'savage' ? 'active' : ''}`} onClick={() => setFilter('savage')}>🔥 Savage</button>
          <button className={`filter-tab ${filter === 'midnight' ? 'active' : ''}`} onClick={() => setFilter('midnight')}>🌙 Late Night</button>
          <button className={`filter-tab ${filter === 'safe' ? 'active' : ''}`} onClick={() => setFilter('safe')}>✅ Safe</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-text">No transactions in this filter</div>
        </div>
      ) : (
        <div className="txn-list">
          {filtered.map(exp => {
            const cat = CATEGORIES[exp.category] || CATEGORIES.food_delivery;
            const tc = tierClass(exp.tier);
            return (
              <div key={exp.id}>
                <div className="txn-item">
                  <div className={`txn-icon ${tc}`}>{cat.icon}</div>
                  <div className="txn-details">
                    <div className="txn-title">
                      {exp.description}
                      {exp.isMidnightDemonic && (
                        <span className="tag tag-violet" style={{ fontSize: '10px' }}>
                          <Moon size={10} /> 2 AM
                        </span>
                      )}
                    </div>
                    <div className="txn-meta">{fmtTime(exp.timestamp)} · {cat.label}</div>
                  </div>
                  <div className="txn-right">
                    <div className="txn-amount">₹{exp.amount.toLocaleString('en-IN')}</div>
                    <span className={`tag ${tierTag(exp.tier)}`} style={{ marginTop: '4px', display: 'inline-flex' }}>
                      {exp.impulseScore}/100
                    </span>
                  </div>
                </div>

                {/* Roast bubble */}
                <div style={{ padding: '0 20px 0 74px' }}>
                  <div className={`txn-roast level-${exp.tier?.toLowerCase() || 'safe'}`}>
                    <span style={{ fontSize: '14px', flexShrink: 0 }}>
                      {exp.tier === 'SAVAGE' ? '🔥' : exp.tier === 'MEDIUM' ? '🌶️' : exp.tier === 'MILD' ? '👀' : '🌱'}
                    </span>
                    <span style={{ flex: 1 }}>"{exp.roastText}"</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => speak(exp.roastText)} title="Listen in Sanju Baba (Sanjay Dutt) Voice" style={{ padding: '2px 4px', flexShrink: 0, color: '#dc2626' }}>
                      <Volume2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="txn-footer">
                  <span style={{ fontSize: '11px', color: '#a3a3a3' }}>{exp.severityLabel}</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => onDeleteExpense(exp.id)} style={{ color: '#ef4444' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
