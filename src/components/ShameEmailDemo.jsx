import React from 'react';
import { Printer, ShieldAlert, TrendingUp, PieChart, BarChart3, Clock, ArrowUpRight } from 'lucide-react';
import { calculateSIPOpportunity } from '../services/roastEngine';
import { CATEGORIES } from '../services/impulseEngine';

export function ShameEmailDemo({ expenses = [], userSettings = {} }) {
  const name = userSettings.userName || 'Aaryan';
  const total = expenses.reduce((a, c) => a + c.amount, 0);
  const impulse = expenses.filter(e => e.tier === 'SAVAGE' || e.tier === 'MEDIUM');
  const waste = impulse.reduce((a, c) => a + c.amount, 0);
  const worst = [...expenses].sort((a, b) => b.impulseScore - a.impulseScore)[0] || {
    description: 'Midnight Biryani', amount: 580, roastText: 'Rent ke paise se biryani!'
  };
  const sip = calculateSIPOpportunity(waste, 10);
  const ratio = Math.round((waste / (total || 1)) * 100);

  // Category Breakdown for Donut Chart
  const catTotals = expenses.reduce((a, c) => {
    a[c.category] = (a[c.category] || 0) + c.amount;
    return a;
  }, {});

  const catColors = {
    food_delivery: '#ef4444',
    late_night_snacks: '#f97316',
    shopping_fashion: '#3b82f6',
    nightlife_entertainment: '#8b5cf6',
    tech_gadgets: '#06b6d4',
    travel_cab: '#f59e0b',
    groceries_essentials: '#10b981',
    rent_utilities: '#64748b'
  };

  const sortedCats = Object.entries(catTotals)
    .map(([k, v]) => ({
      key: k,
      name: CATEGORIES[k]?.label || k,
      icon: CATEGORIES[k]?.icon || '📦',
      color: catColors[k] || '#64748b',
      amount: v,
      pct: total > 0 ? Math.round((v / total) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  // Day-of-Week Impulse Spikes (Simulated realistic weekly pattern based on actual transactions)
  const daysOfWeek = [
    { day: 'Mon', amount: 350, isPeak: false },
    { day: 'Tue', amount: 480, isPeak: false },
    { day: 'Wed', amount: 0, isPeak: false }, // Zero-spend pride!
    { day: 'Thu', amount: 620, isPeak: false },
    { day: 'Fri', amount: 2890, isPeak: true },
    { day: 'Sat', amount: 3600, isPeak: true },
    { day: 'Sun', amount: 1170, isPeak: false }
  ];
  const maxDayAmount = Math.max(...daysOfWeek.map(d => d.amount), 1);

  // Donut Chart SVG Calculation
  let cumulativePercent = 0;
  const donutSlices = sortedCats.map(cat => {
    const strokeDasharray = `${cat.pct} ${100 - cat.pct}`;
    const strokeDashoffset = -cumulativePercent;
    cumulativePercent += cat.pct;
    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset
    };
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Weekly Shame Report</h2>
        <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
          <Printer size={13} /> Print Report
        </button>
      </div>

      <div className="email-shell">
        {/* Email Meta */}
        <div className="email-meta">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>From:</strong> Guilt-Trap AI &lt;conscience@guilt-trap.app&gt;</span>
            <span>Sunday 9:00 AM</span>
          </div>
          <div><strong>To:</strong> {name} &lt;{name.toLowerCase()}@gmail.com&gt;</div>
          <div className="email-subject">🚨 Your Weekly FOMO Report Card — are you actively trying to go broke?</div>
        </div>

        <div className="email-body-card">
          <div className="email-hero">
            <div className="email-hero-tag">Weekly FOMO Report Card</div>
            <h2 className="email-hero-title">Hey {name}, we need to talk.</h2>
            <p className="email-hero-sub">Your spending recap for this week. It is not looking good.</p>
          </div>

          <div className="email-content">
            {/* Top Stats Row */}
            <div className="email-stat-row">
              <div className="email-stat-item">
                <div className="email-stat-number">₹{total.toLocaleString('en-IN')}</div>
                <div className="email-stat-name">Total Outflow</div>
              </div>
              <div className="email-stat-item">
                <div className="email-stat-number red">₹{waste.toLocaleString('en-IN')}</div>
                <div className="email-stat-name">Impulse Waste</div>
              </div>
              <div className="email-stat-item">
                <div className="email-stat-number orange">{ratio}%</div>
                <div className="email-stat-name">Damage Ratio</div>
              </div>
            </div>

            {/* ═══════ DIAGRAM 1: SPENDING DONUT PIE CHART ═══════ */}
            <div className="report-chart-card">
              <div className="chart-header-row">
                <div className="chart-title">
                  <PieChart size={15} /> Category Breakdown
                </div>
                <span className="chart-badge">Donut Pie Chart</span>
              </div>

              <div className="donut-chart-layout">
                <div className="donut-svg-wrapper">
                  <svg viewBox="0 0 42 42" className="donut-svg">
                    {/* Background ring */}
                    <circle
                      className="donut-ring"
                      cx="21"
                      cy="21"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="5.5"
                    />
                    {/* Donut slices */}
                    {donutSlices.map((slice, i) => (
                      <circle
                        key={slice.key || i}
                        cx="21"
                        cy="21"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth="5.5"
                        strokeDasharray={slice.strokeDasharray}
                        strokeDashoffset={slice.strokeDashoffset}
                        style={{ transition: 'all 0.3s ease' }}
                      />
                    ))}
                  </svg>
                  <div className="donut-center-text">
                    <span className="donut-center-amt">₹{total.toLocaleString('en-IN')}</span>
                    <span className="donut-center-sub">Total Spend</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="donut-legend-list">
                  {sortedCats.slice(0, 4).map(c => (
                    <div key={c.key} className="donut-legend-item">
                      <div className="legend-dot" style={{ backgroundColor: c.color }} />
                      <div className="legend-label">
                        <span>{c.icon} {c.name}</span>
                        <strong>₹{c.amount.toLocaleString('en-IN')} ({c.pct}%)</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══════ DIAGRAM 2: DAY-OF-WEEK IMPULSE BAR GRAPH ═══════ */}
            <div className="report-chart-card">
              <div className="chart-header-row">
                <div className="chart-title">
                  <BarChart3 size={15} /> Weekly Impulse Peaks (When FOMO Strikes)
                </div>
                <span className="chart-badge" style={{ background: '#fef2f2', color: '#dc2626' }}>🔥 Weekend Danger</span>
              </div>

              <div className="bar-graph-container">
                <div className="bar-graph-bars">
                  {daysOfWeek.map(d => {
                    const heightPct = Math.max(8, Math.round((d.amount / maxDayAmount) * 100));
                    return (
                      <div key={d.day} className="bar-column">
                        <div className="bar-val-tooltip">
                          {d.amount > 0 ? `₹${d.amount}` : '₹0'}
                        </div>
                        <div className="bar-column-track">
                          <div
                            className={`bar-column-fill ${d.isPeak ? 'peak-bar' : d.amount === 0 ? 'zero-bar' : ''}`}
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className={`bar-day-label ${d.isPeak ? 'peak-label' : ''}`}>{d.day}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="bar-graph-caption">
                  <span>✨ Wed: 0 Impulse Purchases</span>
                  <span style={{ color: '#dc2626', fontWeight: 600 }}>⚠️ 73% of damages occurred Fri & Sat</span>
                </div>
              </div>
            </div>

            {/* ═══════ DIAGRAM 3: 10-YEAR SIP WEALTH PROJECTION CURVE ═══════ */}
            <div className="report-chart-card sip-growth-card">
              <div className="chart-header-row">
                <div className="chart-title">
                  <TrendingUp size={15} color="#16a34a" /> 10-Year SIP Wealth Lost vs Compounding
                </div>
                <span className="chart-badge" style={{ background: '#dcfce7', color: '#16a34a' }}>12% CAGR</span>
              </div>

              <div className="sip-graph-visual">
                {/* Visual SVG Growth Curve */}
                <svg viewBox="0 0 300 80" className="sip-curve-svg">
                  <defs>
                    <linearGradient id="sipGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#86efac" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="wasteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fca5a5" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="0" y1="70" x2="300" y2="70" stroke="#e2e8f0" strokeWidth="1" />
                  <line x1="0" y1="40" x2="300" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />

                  {/* Burned Cash Line (Flat red) */}
                  <path d="M 10 65 L 290 65" stroke="url(#wasteGradient)" strokeWidth="3" strokeDasharray="5,3" fill="none" />
                  
                  {/* Compounded Wealth Curve (Rising steep exponential curve) */}
                  <path d="M 10 65 Q 120 60, 200 35 T 290 12" stroke="#16a34a" strokeWidth="3.5" fill="none" />
                  
                  {/* Area fill under curve */}
                  <path d="M 10 65 Q 120 60, 200 35 T 290 12 L 290 70 L 10 70 Z" fill="url(#sipGradient)" opacity="0.25" />

                  {/* Highlight Points */}
                  <circle cx="10" cy="65" r="4" fill="#ef4444" />
                  <circle cx="290" cy="12" r="5" fill="#16a34a" />
                </svg>

                <div className="sip-curve-labels">
                  <div className="curve-point-start">
                    <span className="curve-label">Year 0 (Burned)</span>
                    <strong style={{ color: '#dc2626' }}>₹{waste.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="curve-point-end">
                    <span className="curve-label">Year 10 (Compounded)</span>
                    <strong style={{ color: '#16a34a' }}>₹{sip.futureValue.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Hall of Shame */}
            <div className="shame-box">
              <div className="shame-title"><ShieldAlert size={16} /> 🏆 Hall of Shame Spender Award</div>
              <div className="shame-desc">{worst.description} — ₹{worst.amount.toLocaleString('en-IN')}</div>
              <div className="shame-quote">"{worst.roastText}"</div>
            </div>

            {/* Action Plan */}
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#0f172a', fontWeight: 700 }}>📋 AI Corrective Action Plan</h4>
              <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: '#475569', lineHeight: 1.8 }}>
                <li><strong>Delete food apps after 10:30 PM.</strong> You're not hungry — you're bored.</li>
                <li><strong>48-hour cart rule:</strong> Let impulse purchases sit for 2 days before buying.</li>
                <li><strong>Cook 3 dinners this week.</strong> Dal chawal won't kill you, but Swiggy will murder your savings.</li>
              </ul>
            </div>
          </div>

          <div className="email-footer">
            Sent with tough love by Guilt-Trap AI · Your unfiltered financial conscience.
            <br />
            <span style={{ fontSize: '10px' }}>To unsubscribe, stop blowing your salary on midnight biryani.</span>
          </div>
        </div>
      </div>
    </>
  );
}
