// Curated library of Gen-Z / Desi meme templates with SVG visuals and presets

export const MEME_TEMPLATES = [
  {
    id: 'babu_bhaiya',
    name: 'Babu Bhaiya Panic',
    character: 'Babu Rao',
    topText: 'KHOPDI TOD SAALE KA!',
    bottomText: 'RENT KE PAISE SE BIRYANI?',
    bgColor: '#dc2626',
    emoji: '🥸',
    avatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
    tags: ['food_delivery', 'savage', 'high_freq']
  },
  {
    id: 'clown_progression',
    name: 'Clown Financial Journey',
    character: 'Full Clown',
    topText: 'ME: KAL SE BUDGET PAKKA',
    bottomText: 'ALSO ME AT 2 AM: CART TOTAL ₹1,850',
    bgColor: '#7c3aed',
    emoji: '🤡',
    avatar: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80',
    tags: ['late_night', 'shopping', 'savage']
  },
  {
    id: 'paisa_barbaad',
    name: 'Paisa Barbaad BC',
    character: 'Dukhi Aatma',
    topText: 'KAHAN GAYE 10,000 RUPAYE?',
    bottomText: 'BILKUL RISK NAHI LENE KA THA!',
    bgColor: '#ea580c',
    emoji: '💸',
    avatar: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80',
    tags: ['high_amount', 'tech_gadgets', 'club']
  },
  {
    id: 'cheems_crying',
    name: 'Doge Cheems Regret',
    character: 'Cheems',
    topText: 'BANK SMS: A/C DEBITED BY ₹899',
    bottomText: 'MUMMY KO KYA BOLOONGA...',
    bgColor: '#ca8a04',
    emoji: '🐕',
    avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=80',
    tags: ['mild', 'food_delivery', 'snacks']
  },
  {
    id: 'not_stonks',
    name: 'Not Stonks',
    character: 'Meme Man',
    topText: 'SPENT ₹1,200 TO SAVE ₹60 DELIVERY',
    bottomText: 'FINANSHAL GINIUS 📉',
    bgColor: '#b91c1c',
    emoji: '📉',
    avatar: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
    tags: ['shopping', 'medium', 'deals']
  },
  {
    id: 'this_is_fine',
    name: 'Everything Is Fine Dog',
    character: 'Dog in Fire',
    topText: 'SALARY CREDITED 3 DAYS AGO',
    bottomText: 'CURRENT BALANCE: ₹340.50 🔥',
    bgColor: '#c2410c',
    emoji: '🔥',
    avatar: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80',
    tags: ['nightlife', 'savage', 'weekend']
  }
];

export function getMemeForCategory(category, severity) {
  if (severity === 'SAVAGE') {
    return MEME_TEMPLATES.find(m => m.id === 'babu_bhaiya') || MEME_TEMPLATES[0];
  }
  if (category === 'late_night_snacks') {
    return MEME_TEMPLATES.find(m => m.id === 'clown_progression') || MEME_TEMPLATES[1];
  }
  if (category === 'shopping_fashion') {
    return MEME_TEMPLATES.find(m => m.id === 'not_stonks') || MEME_TEMPLATES[4];
  }
  if (category === 'nightlife_entertainment') {
    return MEME_TEMPLATES.find(m => m.id === 'this_is_fine') || MEME_TEMPLATES[5];
  }
  return MEME_TEMPLATES.find(m => m.id === 'cheems_crying') || MEME_TEMPLATES[3];
}
