export const CATEGORIES = {
  food_delivery: { id: 'food_delivery', label: 'Food Delivery (Swiggy/Zomato)', icon: '🍔', weight: 0.85, color: '#ef4444' },
  late_night_snacks: { id: 'late_night_snacks', label: 'Quick Commerce (Blinkit/Zepto)', icon: '⚡', weight: 0.90, color: '#f97316' },
  shopping_fashion: { id: 'shopping_fashion', label: 'Retail Therapy (Myntra/Amazon/Zara)', icon: '👗', weight: 0.80, color: '#3b82f6' },
  nightlife_entertainment: { id: 'nightlife_entertainment', label: 'Pubs, Clubs & Alcohol', icon: '🍻', weight: 0.95, color: '#8b5cf6' },
  travel_cab: { id: 'travel_cab', label: 'Cabs & Spontaneous Rides', icon: '🚕', weight: 0.60, color: '#f59e0b' },
  tech_gadgets: { id: 'tech_gadgets', label: 'Tech & Shiny Gadgets', icon: '🎧', weight: 0.75, color: '#06b6d4' },
  groceries_essentials: { id: 'groceries_essentials', label: 'Essentials & Medicine', icon: '🥦', weight: 0.10, color: '#10b981' },
  rent_utilities: { id: 'rent_utilities', label: 'Bills & Rent', icon: '🏠', weight: 0.0, color: '#64748b' }
};

export function autoDetectCategory(description = '') {
  const d = description.toLowerCase();
  if (d.match(/swiggy|zomato|biryani|pizza|burger|mcdonald|kfc|subway|shawarma|rolls|chai|starbucks/)) return 'food_delivery';
  if (d.match(/blinkit|zepto|instamart|chips|doritos|coke|redbull|monster|munchies|snack/)) return 'late_night_snacks';
  if (d.match(/myntra|zara|h&m|sneakers|nike|shoes|hoodie|shirt|jeans|perfume|nykaa/)) return 'shopping_fashion';
  if (d.match(/beer|shots|pub|club|cocktail|whiskey|bar|party|drinks|vodka/)) return 'nightlife_entertainment';
  if (d.match(/uber|ola|cab|auto|rapido/)) return 'travel_cab';
  if (d.match(/headphones|airpods|keyboard|mouse|gadget|charger|smartwatch|iphone/)) return 'tech_gadgets';
  if (d.match(/medicine|pharmacy|vegetables|milk|bread|doodh|grocery|groceries|dawa/)) return 'groceries_essentials';
  if (d.match(/electricity|rent|wifi|broadband|bill|recharge/)) return 'rent_utilities';
  return 'food_delivery';
}

export function calculateImpulseScore({ amount, category, timestamp = new Date().toISOString(), description = '', recentExpenses = [] }) {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const cat = CATEGORIES[category] || CATEGORIES.food_delivery;

  let score = 0;

  // 1. Time-of-day penalty (11 PM - 4 AM Demonic Window)
  const isMidnightDemonic = hour >= 23 || hour < 4;
  if (isMidnightDemonic) score += 35;
  else if (hour >= 21 || hour < 6) score += 15;

  // 2. Category Base Penalty
  score += cat.weight * 35;

  // 3. Ticket Size
  if (category === 'food_delivery' || category === 'late_night_snacks') {
    if (amount > 800) score += 20;
    else if (amount > 400) score += 12;
  } else if (category === 'shopping_fashion' || category === 'tech_gadgets') {
    if (amount > 5000) score += 20;
    else if (amount > 2000) score += 12;
  } else if (category === 'nightlife_entertainment') {
    if (amount > 2500) score += 20;
    else if (amount > 1200) score += 12;
  }

  // 4. Repeat Order Velocity
  const oneDayAgo = new Date(date.getTime() - 24 * 3600 * 1000);
  const recentSameCat = recentExpenses.filter(e => e.category === category && new Date(e.timestamp) > oneDayAgo).length;
  if (recentSameCat >= 2) score += 15;
  else if (recentSameCat === 1) score += 8;

  score = Math.min(100, Math.max(0, Math.round(score)));

  let tier = 'SAFE';
  let severityLabel = 'Responsible Spend';
  if (score >= 70) {
    tier = 'SAVAGE';
    severityLabel = 'Level 3: Savage Guilt-Trap';
  } else if (score >= 40) {
    tier = 'MEDIUM';
    severityLabel = 'Level 2: Medium Roast';
  } else if (score >= 20) {
    tier = 'MILD';
    severityLabel = 'Level 1: Mild Sarcasm';
  }

  return {
    score,
    tier,
    severityLabel,
    isMidnightDemonic
  };
}
