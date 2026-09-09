import express from 'express';
import { readDB } from '../db.js';
import { calculateSIPOpportunity } from '../services/roastEngine.js';
import { CATEGORIES } from '../services/impulseEngine.js';

const router = express.Router();

router.get('/weekly', (req, res) => {
  const userId = req.query.userId || 'user_aaryan';
  const db = readDB();
  const user = db.users.find(u => u.id === userId) || { name: 'Aaryan Sharma' };
  const expenses = db.expenses[userId] || [];

  const total = expenses.reduce((a, c) => a + c.amount, 0);
  const impulse = expenses.filter(e => e.tier === 'SAVAGE' || e.tier === 'MEDIUM');
  const waste = impulse.reduce((a, c) => a + c.amount, 0);
  const worst = [...expenses].sort((a, b) => b.impulseScore - a.impulseScore)[0] || null;
  const sip = calculateSIPOpportunity(waste, 10);
  const ratio = total > 0 ? Math.round((waste / total) * 100) : 0;

  // Category Breakdown for Donut Chart
  const catTotals = expenses.reduce((a, c) => {
    a[c.category] = (a[c.category] || 0) + c.amount;
    return a;
  }, {});

  const categoryBreakdown = Object.entries(catTotals).map(([k, v]) => ({
    category: k,
    label: CATEGORIES[k]?.label || k,
    icon: CATEGORIES[k]?.icon || '📦',
    amount: v,
    percentage: total > 0 ? Math.round((v / total) * 100) : 0
  })).sort((a, b) => b.amount - a.amount);

  // Day of Week Impulse Spikes
  const daysOfWeek = [
    { day: 'Mon', amount: 350, isPeak: false },
    { day: 'Tue', amount: 480, isPeak: false },
    { day: 'Wed', amount: 0, isPeak: false },
    { day: 'Thu', amount: 620, isPeak: false },
    { day: 'Fri', amount: 2890, isPeak: true },
    { day: 'Sat', amount: 3600, isPeak: true },
    { day: 'Sun', amount: 1170, isPeak: false }
  ];

  res.json({
    userName: user.name,
    totalOutflow: total,
    impulseWaste: waste,
    damageRatio: ratio,
    worstDecision: worst,
    sipOpportunity: sip,
    categoryBreakdown,
    daysOfWeek,
    actionPlan: [
      'Delete food delivery apps after 10:30 PM. You are not hungry — you are bored.',
      '48-hour cart rule: Let impulse purchases sit for 2 days before buying.',
      'Cook 3 dinners this week. Dal chawal will save your wallet from Swiggy murder.'
    ]
  });
});

export default router;
