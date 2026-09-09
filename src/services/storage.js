// Local Storage & Firebase Adapter for Guilt-Trap

const STORAGE_KEY = 'guilt_trap_expenses_v1';
const SETTINGS_KEY = 'guilt_trap_settings_v1';

export const INITIAL_EXPENSES = [
  {
    id: 'exp_1',
    description: 'Midnight Dum Biryani + Extra Raita (Swiggy)',
    amount: 580,
    category: 'food_delivery',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
    impulseScore: 92,
    tier: 'SAVAGE',
    severityLabel: 'Level 3: Savage Guilt-Trap',
    roastText: 'Bhai 3rd Swiggy order in 2 days? Rent bhi dena hai ya sirf biryani pe hi guzara chalega? ₹580 uda diye!',
    memeId: 'babu_bhaiya',
    isMidnightDemonic: true
  },
  {
    id: 'exp_2',
    description: 'Blinkit: Doritos + 2 Monster Energy + Brownie',
    amount: 420,
    category: 'late_night_snacks',
    timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(), // late night yesterday
    impulseScore: 86,
    tier: 'SAVAGE',
    severityLabel: 'Level 3: Savage Guilt-Trap',
    roastText: 'Midnight 2:30 AM Blinkit cart? Subah uth ke regret karega, aur tera pancreas aur wallet dono strike pe hain!',
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
    roastText: 'Myntra pe discount dekh ke pighal gaye na? ₹2,890 bachane ke chakkar mein uda diye! Wardrobe mein jagah nahi hai!',
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
    roastText: 'Club jaake "Shots on me" bolne ka shauq tha? Kal subah hangover nahi, bank statement dekh ke heart attack aayega!',
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
    roastText: 'Sensible spend of ₹460. Your financial sanity is intact... for now! 👍',
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
];

export function loadExpenses(userId = 'default') {
  try {
    const userKey = `${STORAGE_KEY}_${userId}`;
    const userRaw = localStorage.getItem(userKey);
    if (userRaw) {
      const parsed = JSON.parse(userRaw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }

    // Fallback to legacy single-user key if migrating
    const legacyRaw = localStorage.getItem(STORAGE_KEY);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        saveExpenses(parsed, userId);
        return parsed;
      }
    }

    // Initialize with standard demo expenses
    saveExpenses(INITIAL_EXPENSES, userId);
    return INITIAL_EXPENSES;
  } catch (err) {
    console.error('Failed to load expenses from localStorage:', err);
    return INITIAL_EXPENSES;
  }
}

export function saveExpenses(expenses, userId = 'default') {
  try {
    const userKey = `${STORAGE_KEY}_${userId}`;
    localStorage.setItem(userKey, JSON.stringify(expenses));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)); // keep legacy synced
  } catch (err) {
    console.error('Failed to save expenses to localStorage:', err);
  }
}

export function loadSettings(userId = 'default') {
  try {
    const userKey = `${SETTINGS_KEY}_${userId}`;
    const userRaw = localStorage.getItem(userKey);
    if (userRaw) return JSON.parse(userRaw);

    const legacyRaw = localStorage.getItem(SETTINGS_KEY);
    if (legacyRaw) return JSON.parse(legacyRaw);

    return {
      geminiApiKey: '',
      monthlyBudget: 25000,
      userName: 'Aaryan',
      audioEnabled: true
    };
  } catch (err) {
    return {
      geminiApiKey: '',
      monthlyBudget: 25000,
      userName: 'Aaryan',
      audioEnabled: true
    };
  }
}

export function saveSettings(settings, userId = 'default') {
  try {
    const userKey = `${SETTINGS_KEY}_${userId}`;
    localStorage.setItem(userKey, JSON.stringify(settings));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

export function resetToDemoData(userId = 'default') {
  saveExpenses(INITIAL_EXPENSES, userId);
  return INITIAL_EXPENSES;
}

