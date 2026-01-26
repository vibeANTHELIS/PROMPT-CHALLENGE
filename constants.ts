import { MarketData, Language } from './types';

export const APP_NAME = "Multilingual Mandi";

// Viksit Bharat Theme Colors
export const COLORS = {
  saffron: '#FF9933',
  white: '#FFFFFF',
  green: '#138808',
  blue: '#000080' // Chakra blue
};

export const SUPPORTED_LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
];

export const MOCK_MARKET_DATA: MarketData[] = [
  { item: 'Onion (Red)', average: 45, high: 60, low: 35, trend: 'up', unit: 'kg' },
  { item: 'Tomato (Hybrid)', average: 30, high: 40, low: 22, trend: 'down', unit: 'kg' },
  { item: 'Potato (Local)', average: 25, high: 32, low: 18, trend: 'stable', unit: 'kg' },
  { item: 'Rice (Basmati)', average: 95, high: 140, low: 80, trend: 'up', unit: 'kg' },
  { item: 'Wheat (Sharbati)', average: 42, high: 50, low: 35, trend: 'stable', unit: 'kg' },
];

export const VOICE_SIMULATION_SAMPLES: { lang: Language; text: string }[] = [
  { lang: 'hi', text: 'मेरे पास 50 किलो ताजे लाल प्याज हैं, 40 रुपये प्रति किलो।' },
  { lang: 'en', text: 'I have 100 kg of fresh tomatoes available for 30 rupees per kg.' },
  { lang: 'hi', text: 'बढ़िया क्वालिटी के आलू, 25 रुपये किलो, तुरंत संपर्क करें।' },
  { lang: 'en', text: 'Selling high quality Basmati rice, 95 rupees per kg, 500kg available.' },
];

export const AVATAR_URLS = [
  "https://picsum.photos/seed/farmer1/64/64",
  "https://picsum.photos/seed/farmer2/64/64",
  "https://picsum.photos/seed/buyer1/64/64",
];