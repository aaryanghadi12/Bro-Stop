import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

router.get('/users', (req, res) => {
  const db = readDB();
  res.json({ users: db.users });
});

router.post('/login', (req, res) => {
  const { identifier, name } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Mobile number or email required' });
  }

  const db = readDB();
  const clean = identifier.trim().toLowerCase();
  
  let user = db.users.find(u => 
    u.phone.includes(clean) || u.email.toLowerCase() === clean || u.name.toLowerCase().includes(clean)
  );

  if (!user) {
    user = {
      id: `user_${clean.replace(/[^a-z0-9]/g, '_') || Date.now()}`,
      name: name?.trim() || (clean.includes('@') ? clean.split('@')[0] : 'Splurger'),
      phone: clean.startsWith('+91') ? clean : `+91 ${clean}`,
      email: clean.includes('@') ? clean : `${clean}@guilttrap.app`,
      avatar: '👤',
      monthlyBudget: 25000,
      joinDate: 'Just joined'
    };
    db.users.push(user);
    if (!db.expenses[user.id]) {
      db.expenses[user.id] = [];
    }
    writeDB(db);
  }

  res.json({
    success: true,
    user,
    token: `token_${user.id}_${Date.now()}`
  });
});

export default router;
