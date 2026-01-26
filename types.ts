export type Language = 'en' | 'hi';

export interface Translation {
  original: string;
  translated: string;
  language: Language; // Language of the original text
  confidence?: number;
}

export interface Listing {
  id: string;
  vendorName: string;
  item: string;
  quantity: string;
  price: number;
  currency: string;
  description: Translation;
  imageUrl?: string;
  category?: string; // Added category for filtering
  createdAt: number;
  updatedAt: number;
  status: 'active' | 'sold';
}

export interface Message {
  id: string;
  senderId: string;
  text: Translation;
  timestamp: number;
  isSystem?: boolean;
}

export interface ChatSession {
  id: string;
  listingId: string;
  vendorId: string;
  buyerId: string;
  messages: Message[];
}

export interface MarketData {
  item: string;
  average: number;
  high: number;
  low: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
}