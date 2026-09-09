import React from 'react';
import { Flame, AlertTriangle, Moon, PieChart, TrendingDown, ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../services/impulseEngine';

export function Dashboard({ expenses = [] }) {
  const totalSpend = expenses.reduce((a, c) => a + c.amount, 0);
  const impulseExp = expenses.filter(e => e.tier === 'SAVAGE' || e.tier === 'MEDIUM');
  const impulseWaste = impulseExp.reduce((a, c) => a + c.amount, 0);
  const essentialSpend = Math.max(0, totalSpend - impulseWaste);
  const impulsePerc = totalSpend > 0 ? Math.round((impulseWaste / totalSpend) * 100) : 0;
  const avgScore = expenses.length > 0 ? Math.round(expenses.reduce((a, c) => a + c.impulseScore, 0) / expenses.length) : 0;
  const midnightCount = expenses.filter(e => e.isMidnightDemonic).length;
  const worst = [...expenses].sort((a, b) => b.impulseScore - a.impulseScore)[0];

  const catTotals = expenses.reduce((a, c) => { a[c.category] = (a[c.category] || 0) + c.amount; return a; }, {});
  const sortedCats = Object.entries(catTotals)
    .map(([k, v]) => ({
      key: k,
      name: CATEGORIES[k]?.label || k,
      icon: CATEGORIES[k]?.icon || '📦',
      color: CATEGORIES[k]?.color || '#8b5cf6',
      total: v,
      pct: totalSpend > 0 ? Math.round((v / totalSpend) * 100) : 0
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="dashboard-wrapper">
      {/* Hero Financial Health Card (Fintech Mobile Pattern) */}
      <div className="hero-balance-card">
        <div className="hero-balance-header">
          <div className="hero-balance-meta">
            <span className="hero-balance-tag">Monthly Spending Overview</span>
            <div className="hero-main-figure">
              <span className="currency-symbol">₹</span>
              <span className="amount-number">{totalSpend.toLocaleString('en-IN')}</span>
            </div>
            <div className="hero-sub-meta">
              <span>{expenses.length} transactions logged this month</span>
            </div>
          </div>
          <div className="hero-score-badge">
            <span className="hero-badge-label">Guilt Score</span>
            <span className="hero-badge-value">{avgScore}<span>/100</span></span>
          </div>
        </div>

        {/* Impulse Split Bar */}
        <div className="hero-split-container">
          <div className="hero-split-bar">
            <div className="split-fill-impulse" style={{ width: `${impulsePerc}%` }} />
            <div className="split-fill-safe" style={{ width: `${100 - impulsePerc}%` }} />
          </div>
          <div className="hero-split-labels">
            <span className="split-label-red">🔥 Impulse: ₹{impulseWaste.toLocaleString('en-IN')} ({impulsePerc}%)</span>
            <span className="split-label-green">🌱 Essential: ₹{essentialSpend.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* 2x2 Clean Stats Grid */}
      <div className="mobile-stats-grid">
        <div className="card mobile-stat-card">
          <div className="mobile-stat-label">💸 Impulse Waste</div>
          <div className="mobile-stat-value text-danger">₹{impulseWaste.toLocaleString('en-IN')}</div>
          <div className="mobile-stat-sub">{impulsePerc}% of your budget</div>
        </div>

        <div className="card mobile-stat-card">
          <div className="mobile-stat-label">📊 Guilt Index</div>
          <div className="mobile-stat-value text-warning">{avgScore}<span className="denom">/100</span></div>
          <div className="mobile-stat-sub">{avgScore >= 65 ? 'High Risk' : avgScore >= 35 ? 'Moderate Risk' : 'Healthy'}</div>
        </div>

        <div className="card mobile-stat-card">
          <div className="mobile-stat-label">🌙 Late Night Spends</div>
          <div className="mobile-stat-value text-violet">{midnightCount} <span className="denom">orders</span></div>
          <div className="mobile-stat-sub">11 PM – 4 AM window</div>
        </div>

        <div className="card mobile-stat-card">
          <div className="mobile-stat-label">💳 Avg Ticket Size</div>
          <div className="mobile-stat-value text-slate">
            ₹{expenses.length > 0 ? Math.round(totalSpend / expenses.length).toLocaleString('en-IN') : 0}
          </div>
          <div className="mobile-stat-sub">Across {expenses.length} purchases</div>
        </div>
      </div>

      {/* Worst Splurge Card */}
      {worst && worst.tier !== 'SAFE' && (
        <div className="callout callout-danger" style={{ marginBottom: '16px' }}>
          <div className="callout-icon">🚨</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="callout-title" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Worst Decision This Week
            </div>
            <div className="callout-desc" style={{ fontSize: '13px', fontWeight: 700, margin: '2px 0 4px' }}>
              {worst.description} — ₹{worst.amount.toLocaleString('en-IN')}
            </div>
            <div className="callout-quote" style={{ fontSize: '12px', fontStyle: 'italic', color: '#b91c1c' }}>
              "{worst.roastText}"
            </div>
          </div>
          <span className="tag tag-red" style={{ flexShrink: 0, alignSelf: 'flex-start' }}>Score {worst.impulseScore}</span>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-header">
          <h3 className="card-title"><PieChart size={15} /> Spend by Category</h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{sortedCats.length} categories</span>
        </div>
        <div className="card-body" style={{ padding: '14px 16px' }}>
          <div className="bar-list">
            {sortedCats.map(c => (
              <div key={c.key} className="bar-item">
                <div className="bar-label-row">
                  <span className="bar-label-name" style={{ fontSize: '12px' }}><span>{c.icon}</span> {c.name}</span>
                  <span className="bar-label-value" style={{ fontSize: '12px', fontWeight: 600 }}>
                    ₹{c.total.toLocaleString('en-IN')} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({c.pct}%)</span>
                  </span>
                </div>
                <div className="bar-track" style={{ height: '6px' }}>
                  <div className="bar-fill" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
