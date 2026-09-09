// Rule-based Impulse Scoring Engine for Guilt-Trap

export const CATEGORIES = {
  food_delivery: {
    id: 'food_delivery',
    label: 'Food Delivery (Swiggy/Zomato)',
    icon: '🍔',
    baseScore: 35,
    color: '#f97316'
  },
  late_night_snacks: {
    id: 'late_night_snacks',
    label: 'Midnight Quick-Commerce (Blinkit/Zepto)',
    icon: '⚡',
    baseScore: 40,
    color: '#eab308'
  },
  shopping_fashion: {
    id: 'shopping_fashion',
    label: 'Retail Therapy (Myntra/Amazon/Zara)',
    icon: '👗',
    baseScore: 30,
    color: '#ec4899'
  },
  nightlife_entertainment: {
    id: 'nightlife_entertainment',
    label: 'Pubs, Clubs & Alcohol',
    icon: '🍻',
    baseScore: 35,
    color: '#a855f7'
  },
  travel_cab: {
    id: 'travel_cab',
    label: 'Late-night Cabs & Unplanned Trips',
    icon: '🚕',
    baseScore: 25,
    color: '#06b6d4'
  },
  tech_gadgets: {
    id: 'tech_gadgets',
    label: 'Gadgets & Impulse Tech',
    icon: '🎧',
    baseScore: 30,
    color: '#6366f1'
  },
  groceries_essentials: {
    id: 'groceries_essentials',
    label: 'Groceries, Medicine & Daily Needs',
    icon: '🥦',
    baseScore: 5,
    color: '#10b981'
  },
  rent_utilities: {
    id: 'rent_utilities',
    label: 'Rent, Bills & Fixed Expenses',
    icon: '🏠',
    baseScore: 0,
    color: '#059669'
  }
};

/**
 * Calculates rule-based impulse score (0 to 100)
 * @param {Object} params
 * @param {number} params.amount - Spend in INR
 * @param {string} params.category - Category key
 * @param {string|Date} params.timestamp - Date or ISO string
 * @param {string} params.description - Item description
 * @param {Array} params.recentExpenses - Past expenses for frequency checking
 */
export function calculateImpulseScore({ amount, category, timestamp, description = '', recentExpenses = [] }) {
  const catConfig = CATEGORIES[category] || CATEGORIES.food_delivery;
  let score = catConfig.baseScore;
  const breakdown = [];

  // Essential bypass
  if (category === 'rent_utilities' || (category === 'groceries_essentials' && amount < 4000)) {
    return {
      score: Math.min(score, 20),
      tier: 'SAFE',
      severityLabel: 'Responsible Spend',
      isMidnightDemonic: false,
      breakdown: ['Essential category — your financial dignity is intact.']
    };
  }

  // 1. Time-of-day penalty ("The 2 AM Demonic Impulse Window")
  const date = new Date(timestamp);
  const hour = date.getHours();
  let isMidnightDemonic = false;

  if (hour >= 23 || hour < 4) {
    score += 35;
    isMidnightDemonic = true;
    breakdown.push(`🌙 Demonic Late-Night Window (${hour}:00 hrs): +35 pts`);
  } else if (hour >= 4 && hour < 6) {
    score += 20;
    breakdown.push(`🌅 Weird Early Morning Splurge (${hour}:00 hrs): +20 pts`);
  } else if (hour >= 14 && hour <= 17) {
    score += 10;
    breakdown.push(`🥱 Post-Lunch Boredom Ordering: +10 pts`);
  }

  // 2. Frequency penalty: check orders in same category in the last 48 hours
  const now = date.getTime();
  const fortyEightHoursAgo = now - (48 * 60 * 60 * 1000);
  const recentSameCat = recentExpenses.filter(e => {
    const eTime = new Date(e.timestamp).getTime();
    return e.category === category && eTime >= fortyEightHoursAgo && eTime <= now;
  });

  if (recentSameCat.length >= 3) {
    score += 30;
    breakdown.push(`🔥 Serial Spender: ${recentSameCat.length} ${catConfig.label} orders in 48h! (+30 pts)`);
  } else if (recentSameCat.length >= 1) {
    score += 15;
    breakdown.push(`⚠️ Repeated category order within 48 hours: +15 pts`);
  }

  // 3. Amount-based heuristic
  if (['food_delivery', 'late_night_snacks'].includes(category)) {
    if (amount > 1200) {
      score += 25;
      breakdown.push(`💸 Single meal over ₹1,200: +25 pts`);
    } else if (amount > 600) {
      score += 15;
      breakdown.push(`💸 Heavy food bill (>₹600): +15 pts`);
    }
  } else if (category === 'shopping_fashion') {
    if (amount > 3500) {
      score += 25;
      breakdown.push(`🛍️ Splurge shopping over ₹3,500: +25 pts`);
    } else if (amount > 1500) {
      score += 15;
      breakdown.push(`🛍️ Retail impulse (>₹1,500): +15 pts`);
    }
  } else if (category === 'nightlife_entertainment') {
    if (amount > 3000) {
      score += 25;
      breakdown.push(`🍻 Lavish party spend (>₹3,000): +25 pts`);
    }
  }

  // 4. Keyword detection triggers
  const descLower = description.toLowerCase();
  const impulseKeywords = ['biryani', 'pizza', 'burger', 'sneakers', 'sale', 'iphone', 'hoodie', 'cocktail', 'shots', 'boba'];
  if (impulseKeywords.some(kw => descLower.includes(kw))) {
    score += 10;
    breakdown.push(`🎯 High-impulse craving keyword detected: +10 pts`);
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Determine Severity Tier
  let tier = 'SAFE';
  let severityLabel = 'Normal Spend';

  if (score >= 80) {
    tier = 'SAVAGE';
    severityLabel = 'Level 3: Savage Guilt-Trap';
  } else if (score >= 60) {
    tier = 'MEDIUM';
    severityLabel = 'Level 2: Medium Roast';
  } else if (score >= 35) {
    tier = 'MILD';
    severityLabel = 'Level 1: Mild Nudge';
  }

  return {
    score,
    tier,
    severityLabel,
    isMidnightDemonic,
    breakdown
  };
}

/**
 * Auto-detects category from description text
 */
export function autoDetectCategory(description = '') {
  const text = description.toLowerCase();

  if (text.match(/swiggy|zomato|biryani|burger|pizza|mcdonalds|kfc|starbucks|subway|roll|thali|lunch|dinner|chai/)) {
    return 'food_delivery';
  }
  if (text.match(/blinkit|zepto|instamart|chips|ice cream|maggi|chocolate|coke|cold drink|red bull|doritos/)) {
    return 'late_night_snacks';
  }
  if (text.match(/myntra|zara|h&m|amazon|flipkart|sneakers|shoes|shirt|hoodie|perfume|sunglasses|dress|watch/)) {
    return 'shopping_fashion';
  }
  if (text.match(/beer|wine|whiskey|pub|club|bar|shots|cocktail|theka|party|entry fee|social/)) {
    return 'nightlife_entertainment';
  }
  if (text.match(/uber|ola|rapido|cab|flight|train|irctc|weekend trip|goa|manali/)) {
    return 'travel_cab';
  }
  if (text.match(/airpods|headphone|iphone|gaming|mouse|keyboard|charger|ipad|gadget/)) {
    return 'tech_gadgets';
  }
  if (text.match(/rent|electricity|wifi|broadband|water|maintenance|emi|credit card bill/)) {
    return 'rent_utilities';
  }
  if (text.match(/milk|vegetables|fruits|dawa|medicine|apollo|groceries|atta|dal|oil/)) {
    return 'groceries_essentials';
  }

  return 'food_delivery'; // Default fallback
}
