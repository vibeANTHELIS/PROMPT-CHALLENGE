import { Listing, ChatSession } from "../types";

const KEYS = {
  LISTINGS: 'mm_listings',
  CHATS: 'mm_chats',
  USER_MODE: 'mm_user_mode', // 'vendor' or 'buyer'
};

export const saveListings = (listings: Listing[]) => {
  try {
    localStorage.setItem(KEYS.LISTINGS, JSON.stringify(listings));
  } catch (e) {
    console.error("Failed to save listings", e);
  }
};

export const getListings = (): Listing[] => {
  try {
    const data = localStorage.getItem(KEYS.LISTINGS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveChats = (chats: ChatSession[]) => {
  try {
    localStorage.setItem(KEYS.CHATS, JSON.stringify(chats));
  } catch (e) {
    console.error("Failed to save chats", e);
  }
};

export const getChats = (): ChatSession[] => {
  try {
    const data = localStorage.getItem(KEYS.CHATS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveUserMode = (mode: 'vendor' | 'buyer') => {
  localStorage.setItem(KEYS.USER_MODE, mode);
};

export const getUserMode = (): 'vendor' | 'buyer' => {
  return (localStorage.getItem(KEYS.USER_MODE) as 'vendor' | 'buyer') || 'vendor';
};
