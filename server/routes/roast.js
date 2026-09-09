import express from 'express';
import { generateGeminiRoast, generateLocalRoast } from '../services/roastEngine.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { description, amount, category, tier = 'SAVAGE', timestamp = new Date().toISOString() } = req.body;
    const roast = await generateGeminiRoast({
      description,
      amount: Number(amount) || 500,
      category: category || 'food_delivery',
      tier,
      timestamp
    });

    res.json({
      success: true,
      roast
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate roast' });
  }
});

export default router;
