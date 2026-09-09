import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial seed data
const DEFAULT_DATA = {
  users: [
    {
      id: 'user_aaryan',
      name: 'Aaryan Sharma',
      phone: '+91 98765 43210',
      email: 'aaryan@example.com',
      avatar: '👨‍💻',
      monthlyBudget: 25000,
      joinDate: 'Jan 2026'
    },
    {
      id: 'user_neha',
      name: 'Neha Verma',
      phone: '+91 98111 22334',
      email: 'neha@example.com',
      avatar: '👩‍🎨',
      monthlyBudget: 35000,
      joinDate: 'Feb 2026'
    }
  ],
  expenses: {
    user_aaryan: [
      {
        id: 'exp_1',
        description: 'Midnight Dum Biryani + Extra Raita (Swiggy)',
        amount: 580,
        category: 'food_delivery',
        timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        impulseScore: 92,
        tier: 'SAVAGE',
        severityLabel: 'Level 3: Savage Guilt-Trap',
        roastText: 'Aey Bhai! Bole toh ek aur Swiggy order? ₹580 uda diye! Fridge showpiece ke liye rakha hai kya mamu?',
        memeId: 'babu_bhaiya',
        isMidnightDemonic: true
      },
      {
        id: 'exp_2',
        description: 'Blinkit: Doritos + 2 Monster Energy + Brownie',
        amount: 420,
        category: 'late_night_snacks',
        timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        impulseScore: 86,
        tier: 'SAVAGE',
        severityLabel: 'Level 3: Savage Guilt-Trap',
        roastText: 'Aey mamu! Raat ko 2:30 baje ₹420 ka Blinkit cart? Chips aur cold drink se body nahi sirf guilt badhega! Chupchap so jao re baba!',
        memeId: 'clown_progression',
        isMidnightDemonic: true
      },
      {
        id: 'exp_3',
        description: 'Myntra: Casual Sneakers (Flat 40% Off Trap)',
        amount: 2890,
        category: 'shopping_fashion',
        timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
        impulseScore: 74,
        tier: 'MEDIUM',
        severityLabel: 'Level 2: Medium Roast',
        roastText: 'Aey circuit! Dekh isko, Myntra pe "Flat 50% Off" dekh ke pighal gaya! ₹2,890 uda diye! Pure mamu behavior! 🤡',
        memeId: 'not_stonks',
        isMidnightDemonic: false
      },
      {
        id: 'exp_4',
        description: 'Saturday Pub Bill & Shots with Friends',
        amount: 3600,
        category: 'nightlife_entertainment',
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        impulseScore: 90,
        tier: 'SAVAGE',
        severityLabel: 'Level 3: Savage Guilt-Trap',
        roastText: 'Club jaake "Shots on me" bolne ka bhoot sawar tha mamu? ₹3,600 ka bill dekh ke kal subah hangover nahi, bankruptcy aayegi!',
        memeId: 'this_is_fine',
        isMidnightDemonic: true
      },
      {
        id: 'exp_5',
        description: 'Apollo Pharmacy: Fever meds + Multivitamins',
        amount: 460,
        category: 'groceries_essentials',
        timestamp: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
        impulseScore: 10,
        tier: 'SAFE',
        severityLabel: 'Responsible Spend',
        roastText: 'Sensible spend of ₹460 mamu. Apun khush hai, wallet safe hai! 👍',
        memeId: null,
        isMidnightDemonic: false
      },
      {
        id: 'exp_6',
        description: 'Electricity & Broadband Bill',
        amount: 1450,
        category: 'rent_utilities',
        timestamp: new Date(Date.now() - 80 * 3600 * 1000).toISOString(),
        impulseScore: 0,
        tier: 'SAFE',
        severityLabel: 'Responsible Spend',
        roastText: 'Adulting done right. At least the Wi-Fi will stay on while you cry over other impulse spends.',
        memeId: null,
        isMidnightDemonic: false
      }
    ]
  },
  settings: {
    user_aaryan: {
      geminiApiKey: '',
      monthlyBudget: 25000,
      userName: 'Aaryan Sharma',
      audioEnabled: true
    }
  }
};

export function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDB(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read DB:', err);
    return DEFAULT_DATA;
  }
}

export function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write DB:', err);
  }
}
