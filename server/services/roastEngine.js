// Sanjay Dutt (Sanju Baba / Munna Bhai) Backend Roast Engine

const ROAST_TEMPLATES = {
  food_delivery: {
    SAVAGE: [
      (desc, amt) => `Aey Bhai! Bole toh ek aur Swiggy order? ₹${amt} uda diye! Fridge showpiece ke liye rakha hai kya mamu?`,
      (desc, amt) => `Mamu! Waah re shehzade, ₹${amt} ka biryani akele pel diya? Month-end pe dosto se bheekh mangte phiroge dekh lena!`,
      (desc, amt) => `Aey hero, ₹${amt} for "${desc}"? Ambani ki chauthi aulad ho kya re? Baap ka paisa samajh ke phoonk rahe ho!`,
      (desc, amt) => `Bole toh apun ka khopdi ghoom gaya! Zomato discount dekh ke 3 logo ka khana mangwa liya? Stomach aur wallet dono ro rahe hain!`
    ],
    MEDIUM: [
      (desc, amt) => `Aey Bhai, ₹${amt} on "${desc}"? Cooking seekhne ka time kab aayega mamu, retirement ke baad?`,
      (desc, amt) => `Delivery boy ko apna ghar ka address by heart yaad ho gaya hai mamu. Thoda control karo!`,
      (desc, amt) => `Bole toh ₹${amt} gayab. Agle hafte fir rona mat ki 'bhai paise kahan gaye pata nahi chala'.`
    ],
    MILD: [
      (desc, amt) => `Chalo chalega mamu, ₹${amt} khane pe gaya. Par kal subah Maggi pe mat aana fir!`,
      (desc, amt) => `Enjoy karo "${desc}", par yaad rakhna month-end bullet train ki speed se aa raha hai!`
    ]
  },
  late_night_snacks: {
    SAVAGE: [
      (desc, amt) => `Aey mamu! Raat ko 2:30 baje ₹${amt} ka Blinkit cart? Chips aur cold drink se body nahi sirf guilt badhega! Chupchap so jao re baba!`,
      (desc, amt) => `Aey Bhai! Raat ko 1 baje "${desc}" mangwane ka kya logic tha mamu? Apun tere ko samjha raha hai, wallet ko baksh do!`,
      (desc, amt) => `Delivery partner raat ko 3 baje soch raha hoga: 'Bole toh yeh banda din mein so ke raat ko paise kyu jala raha hai?'`
    ],
    MEDIUM: [
      (desc, amt) => `₹${amt} on midnight munchies! Mamu, metabolism aur bank balance dono strike pe jane wale hain!`,
      (desc, amt) => `Blinkit 10-minute delivery ek trap hai mamu, aur tum seedha gale lagane nikal padte ho!`
    ],
    MILD: [
      (desc, amt) => `Late night cravings won again mamu. Agli baar kamre mein bhuna hua chana rakh lena!`
    ]
  },
  shopping_fashion: {
    SAVAGE: [
      (desc, amt) => `Aey circuit! Dekh isko, Myntra pe 'Flat 50% Off' dekh ke pighal gaya! ₹${amt} bachane ke chakkar mein ₹${amt} uda diye! Pure mamu behavior! 🤡`,
      (desc, amt) => `Tera wardrobe already kapdo se phat raha hai re! Fir bhi ₹${amt} ka "${desc}" chahiye tha? Wardrobe therapist hire karo pehle!`,
      (desc, amt) => `₹${amt} for "${desc}"? Pehnoge ek baar, photo daaloge Instagram pe, fir almirah mein sadega mamu!`
    ],
    MEDIUM: [
      (desc, amt) => `Retail therapy se dil ka dard theek nahi hota mamu, bas EMI ka tension badhta hai. ₹${amt} paani mein!`,
      (desc, amt) => `Bole toh sach bol, "${desc}" ka zaroorat tha ya bas dopamine rush ke liye add to cart kiya tha?`
    ],
    MILD: [
      (desc, amt) => `Mamu mast lag raha hai ₹${amt} ka purchase, par do baar se zyada pehno toh baat bane!`
    ]
  },
  nightlife_entertainment: {
    SAVAGE: [
      (desc, amt) => `Club jaake 'Shots on me' bolne ka bhoot sawar tha mamu? ₹${amt} ka bill dekh ke kal subah hangover nahi, bankruptcy aayegi!`,
      (desc, amt) => `DJ ko ₹500 tip aur bar pe ₹${amt}? Ghar aate waqt auto wale se ₹20 ke liye ladoge! Hypocrisy ki seema hoti hai re baba!`,
      (desc, amt) => `₹${amt} uda diye Saturday night ko! Ab Monday se Friday office canteen mein samosa kha ke guzaara karna mamu!`
    ],
    MEDIUM: [
      (desc, amt) => `Pub party was fun mamu? Ab savings account ka balance dekh ke rona mat. ₹${amt} ka jhatka laga hai!`,
      (desc, amt) => `FOMO mein dosto ke sath jaana zaroori tha, par itna kharcha karna optional tha hero.`
    ],
    MILD: [
      (desc, amt) => `Weekend party of ₹${amt}. Balance it out by not ordering food for the next 2 days mamu.`
    ]
  },
  tech_gadgets: {
    SAVAGE: [
      (desc, amt) => `Aey Bhai! Tera purana gadget bilkul mast chal raha tha re! Fir bhi ₹${amt} ka "${desc}" mangwa liya? Tech YouTuber banne ka bhoot sawar hai kya mamu?`,
      (desc, amt) => `₹${amt} on impulsive tech! Productivity 1% bhi nahi badhegi, bas unboxing karke so jaoge!`,
      (desc, amt) => `Bole toh apun circuit ko bolke tera Amazon account band karwa dega! ₹${amt} uda diya bina soche!`
    ],
    MEDIUM: [
      (desc, amt) => `Tech upgrade for ₹${amt}. Dekh lena mamu, yeh table pe dhool na khaye do din baad!`,
      (desc, amt) => `Bhai tech review dekh ke impress mat hua karo har hafte.`
    ],
    MILD: [
      (desc, amt) => `Mamu umeed hai ₹${amt} ka yeh gadget kaam aayega aur sirf showpiece ban ke nahi rahega!`
    ]
  },
  travel_cab: {
    SAVAGE: [
      (desc, amt) => `Aey Bhai! ₹${amt} on Uber Premier cab? Metro aur local se kya dushmani hai mamu? Ambani ke daamad ho kya?`,
      (desc, amt) => `Unplanned trip pe nikal gaye bina budget soche? ₹${amt} lag gaye, ab return mein train ke toilet ke pass khade hoke aana!`,
      (desc, amt) => `Bole toh 2 kilometer ke liye cab kiya? Thoda walk kar lete toh health bhi banti aur wallet bhi bachta!`
    ],
    MEDIUM: [
      (desc, amt) => `₹${amt} on cab travel mamu. Thoda time se nikalte toh metro pakad lete na!`,
      (desc, amt) => `Cab surge pricing dekh ke bhi confirm ride daba diya? You really love burning money mamu!`
    ],
    MILD: [
      (desc, amt) => `Travel expense ₹${amt}. Safe ride mamu, par agli baar thoda pehle nikalne ka!`
    ]
  }
};

export function generateLocalRoast({ description, amount, category, tier }) {
  if (tier === 'SAFE') {
    return `Sensible spend of ₹${amount} mamu. Apun khush hai, wallet safe hai! 👍`;
  }
  const catRoasts = ROAST_TEMPLATES[category] || ROAST_TEMPLATES.food_delivery;
  const list = catRoasts[tier] || catRoasts.MEDIUM || catRoasts.SAVAGE;
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex](description || 'Faltu kharcha', amount);
}

export async function generateGeminiRoast({ description, amount, category, tier, timestamp, apiKey }) {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    return generateLocalRoast({ description, amount, category, tier });
  }

  const prompt = `
You are Bollywood superstar Sanjay Dutt in his iconic Munna Bhai / Sanju Baba persona (deep, gravelly baritone, Mumbai tapori swagger, affectionate yet savage big-brother attitude).
Your job is to roast the user for their impulsive, guilt-inducing spending.
The user just spent ₹${amount} on "${description}" in category "${category}".
Time of purchase: ${new Date(timestamp).toLocaleTimeString()}.
Severity Tier: ${tier} (SAVAGE = brutal, hilarious Sanju Baba roasting; MEDIUM = sarcastic call-out; MILD = witty gentle nudge).

Rules:
1. Speak in Sanjay Dutt's authentic Mumbai tapori Hinglish: use phrases like 'Aey Bhai!', 'Mamu...', 'Bole toh...', 'Apun tere ko bol rela hai', 'Baap ka paisa samajh ke uda raha hai kya re?', 'Khopdi ghoom gaya dekh ke', 'Circuit ko bolke...'.
2. Keep it punchy: exactly 1 to 2 sentences max.
3. Directly reference the actual item ("${description}") and the ₹${amount} spent.
4. If it is late night (11 PM - 4 AM), mercilessly roast their sleep schedule and midnight cravings.
Return ONLY the roast text, nothing else.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 100 }
      })
    });

    if (!response.ok) return generateLocalRoast({ description, amount, category, tier });
    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidate?.trim() || generateLocalRoast({ description, amount, category, tier });
  } catch (err) {
    return generateLocalRoast({ description, amount, category, tier });
  }
}

export function calculateSIPOpportunity(amount, years = 10) {
  const r = 0.12;
  const futureValue = Math.round(amount * Math.pow(1 + r, years));
  return { futureValue, years };
}
