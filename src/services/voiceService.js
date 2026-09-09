/**
 * Voice Synthesis Service tuned for Sanjay Dutt / Sanju Baba (Munna Bhai) style
 * - Selects Indian accent voice (prioritizing 'Google हिन्दी' / hi-IN / en-IN)
 * - Deep baritone pitch (~0.72 - 0.76)
 * - Slow swagger cadence (rate ~0.84 - 0.88)
 * - Authentic Bollywood / Munna Bhai introductory & concluding catchphrases
 */

// Cache voices
let cachedVoices = [];

function loadVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices() || [];
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

/**
 * Finds the best Indian voice matching Sanjay Dutt's persona
 */
export function getSanjuDuttVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Explicit Indian Male voices (e.g., Microsoft Ravi, Indian English male)
  const indianMale = voices.find(v => 
    (v.lang.includes('IN') || v.name.toLowerCase().includes('india')) &&
    (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('ravi') || v.name.toLowerCase().includes('heera'))
  );
  if (indianMale) return indianMale;

  // 2. Google हिन्दी (Indian Hindi voice - lowered pitch provides authentic Bollywood tapori cadence)
  const googleHindi = voices.find(v => v.name.includes('हिन्दी') || v.lang === 'hi-IN' || v.lang === 'hi_IN');
  if (googleHindi) return googleHindi;

  // 3. Deep American/British Male voices (e.g. Microsoft David, Mark - very gravelly and masculine with lower pitch)
  const deepMale = voices.find(v => 
    v.name.toLowerCase().includes('david') || 
    v.name.toLowerCase().includes('mark') || 
    (v.name.toLowerCase().includes('male') && v.lang.startsWith('en'))
  );
  if (deepMale) return deepMale;

  // 4. Any Indian voice fallback
  const anyIndian = voices.find(v => v.lang.includes('IN') || v.name.toLowerCase().includes('india'));
  if (anyIndian) return anyIndian;

  return voices[0] || null;
}

/**
 * Adds iconic Sanjay Dutt / Munna Bhai signature flavour to the speech text
 */
export function formatSanjuDuttSpeechText(text = '') {
  // If already formatted with Sanju Baba intro, keep as is
  if (text.startsWith('Aey Bhai') || text.startsWith('Bole toh') || text.startsWith('Mamu')) {
    return text;
  }

  const intros = [
    'Aey Bhai! Bole toh sunn...',
    'Mamu, dhyan se sunn...',
    'Aey hero, kya kar rela hai tu?',
    'Bole toh apun ka khopdi ghoom gaya dekh ke...',
    'Aey circuit, dekh isko zara!'
  ];

  const outros = [
    'Samjha na mamu? Aage se aisi galti nahi mangti apun ko!',
    'Bole toh wallet ko aaraam de re baba!',
    'Ghar jaake so ja chupchap!',
    'Baap ka paisa hai kya re? Sudhar ja!'
  ];

  const intro = intros[Math.floor(Math.random() * intros.length)];
  const outro = outros[Math.floor(Math.random() * outros.length)];

  return `${intro} ${text} ${outro}`;
}

/**
 * Speaks text using the Sanjay Dutt / Sanju Baba male voice profile (faster & energetic)
 */
export function speakSanjuDutt(rawText, options = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this device/browser');
    return null;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const spokenText = options.skipFormatting ? rawText : formatSanjuDuttSpeechText(rawText);
    const utterance = new SpeechSynthesisUtterance(spokenText);

    const voice = getSanjuDuttVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'hi-IN';
    }

    // Sanjay Dutt Male Vocal Settings:
    // Masculine baritone pitch: 0.76
    // Faster, punchier, high-energy delivery: 1.05 (up from 0.86)
    utterance.pitch = options.pitch ?? 0.76;
    utterance.rate = options.rate ?? 1.05;
    utterance.volume = options.volume ?? 1.0;

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onError = options.onError;

    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (err) {
    console.error('Failed to trigger Sanju Dutt speech:', err);
    return null;
  }
}

/**
 * Stops current speech
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
