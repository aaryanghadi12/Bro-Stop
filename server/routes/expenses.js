import express from 'express';
import multer from 'multer';
import { readDB, writeDB } from '../db.js';
import { calculateImpulseScore } from '../services/impulseEngine.js';
import { generateGeminiRoast, calculateSIPOpportunity } from '../services/roastEngine.js';
import { scanReceiptBuffer } from '../services/receiptScanner.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// GET all expenses for user
router.get('/', (req, res) => {
  const userId = req.query.userId || 'user_aaryan';
  const db = readDB();
  const userExpenses = db.expenses[userId] || [];

  const totalSpend = userExpenses.reduce((a, c) => a + c.amount, 0);
  const impulseWaste = userExpenses
    .filter(e => e.tier === 'SAVAGE' || e.tier === 'MEDIUM')
    .reduce((a, c) => a + c.amount, 0);
  const avgScore = userExpenses.length > 0
    ? Math.round(userExpenses.reduce((a, c) => a + c.impulseScore, 0) / userExpenses.length)
    : 0;

  res.json({
    expenses: userExpenses,
    stats: {
      totalSpend,
      impulseWaste,
      avgScore,
      count: userExpenses.length
    }
  });
});

// POST new expense (runs scoring, Sanjay Dutt roast generation, SIP calculation, persistence)
router.post('/', async (req, res) => {
  try {
    const {
      amount,
      description,
      category,
      timestamp = new Date().toISOString(),
      userId = 'user_aaryan',
      receiptImage = null
    } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid amount required' });
    }

    const db = readDB();
    const userExpenses = db.expenses[userId] || [];
    const userSettings = db.settings[userId] || {};

    const scoreCalc = calculateImpulseScore({
      amount: Number(amount),
      category,
      timestamp,
      description,
      recentExpenses: userExpenses
    });

    const roastText = await generateGeminiRoast({
      description,
      amount: Number(amount),
      category,
      tier: scoreCalc.tier,
      timestamp,
      apiKey: userSettings.geminiApiKey
    });

    const sip = calculateSIPOpportunity(Number(amount), 10);

    const newExpense = {
      id: `exp_${Date.now()}`,
      description: description || 'Unspecified Expense',
      amount: Number(amount),
      category,
      timestamp,
      impulseScore: scoreCalc.score,
      tier: scoreCalc.tier,
      severityLabel: scoreCalc.severityLabel,
      isMidnightDemonic: scoreCalc.isMidnightDemonic,
      roastText,
      sipOpportunity: sip,
      receiptImage
    };

    if (!db.expenses[userId]) {
      db.expenses[userId] = [];
    }
    db.expenses[userId].unshift(newExpense);
    writeDB(db);

    res.status(201).json({
      success: true,
      expense: newExpense
    });
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ error: 'Failed to process expense' });
  }
});

// DELETE / Cancel expense
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.query.userId || 'user_aaryan';

  const db = readDB();
  if (db.expenses[userId]) {
    db.expenses[userId] = db.expenses[userId].filter(e => e.id !== id);
    writeDB(db);
  }

  res.json({ success: true, message: 'Expense deleted' });
});

// POST upload-receipt (Image bill scanning)
router.post('/upload-receipt', upload.single('receipt'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No receipt file provided' });
    }

    const scanned = scanReceiptBuffer(file.originalname, file.buffer);
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    res.json({
      success: true,
      scanned,
      imagePreview: base64Image,
      filename: file.originalname,
      filesize: file.size
    });
  } catch (err) {
    console.error('Failed to parse receipt:', err);
    res.status(500).json({ error: 'Failed to scan receipt image' });
  }
});

export default router;
