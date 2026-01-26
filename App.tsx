import React, { useState, useEffect } from 'react';
import { Listing, ChatSession, Message } from './types';
import VendorDashboard from './components/VendorDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import ChatInterface from './components/ChatInterface';
import { getListings, saveListings, getChats, saveChats, getUserMode, saveUserMode } from './services/storageService';
import { Sprout } from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<'vendor' | 'buyer'>('vendor');
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    try {
      console.log('Initializing app data...');
      setListings(getListings());
      setChats(getChats());
      setRole(getUserMode());
      setIsLoading(false);
      console.log('App data initialized successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
      setIsLoading(false);
    }
  }, []);

  // Persistence - only save if not loading
  useEffect(() => {
    if (!isLoading && listings.length >= 0) {
      saveListings(listings);
    }
  }, [listings, isLoading]);

  useEffect(() => {
    if (!isLoading && chats.length >= 0) {
      saveChats(chats);
    }
  }, [chats, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveUserMode(role);
    }
  }, [role, isLoading]);

  const handleAddListing = (listing: Listing) => {
    setListings(prev => [listing, ...prev]);
  };

  const handleStartChat = (listing: Listing) => {
    // Check if existing chat
    const existingChat = chats.find(c => c.listingId === listing.id);
    if (existingChat) {
      setActiveChat(existingChat);
    } else {
      const newChat: ChatSession = {
        id: crypto.randomUUID(),
        listingId: listing.id,
        vendorId: 'vendor-1', // Mock IDs
        buyerId: 'buyer-1',
        messages: []
      };
      setChats(prev => [...prev, newChat]);
      setActiveChat(newChat);
    }
  };

  const handleSendMessage = (sessionId: string, text: string, translation: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === sessionId) {
        const newMessage: Message = {
          id: crypto.randomUUID(),
          senderId: role,
          timestamp: Date.now(),
          text: {
            original: text,
            translated: translation,
            language: role === 'vendor' ? 'hi' : 'en' // Simplified assumption
          }
        };
        
        // Update active chat ref immediately for UI
        if (activeChat?.id === sessionId) {
          setActiveChat(prevActive => prevActive ? ({
            ...prevActive,
            messages: [...prevActive.messages, newMessage]
          }) : null);
        }
        
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Multilingual Mandi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sticky Top Navigation */}
      <nav className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-1.5 rounded-lg text-white">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-800">
            Multilingual <span className="text-orange-600">Mandi</span>
          </span>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setRole('vendor')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              role === 'vendor' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Farmer
          </button>
          <button 
             onClick={() => setRole('buyer')}
             className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              role === 'buyer' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Buyer
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto p-4 md:max-w-2xl min-h-[calc(100vh-64px)]">
        {role === 'vendor' ? (
          <VendorDashboard listings={listings} onAddListing={handleAddListing} />
        ) : (
          <BuyerDashboard listings={listings} onChat={handleStartChat} />
        )}
      </main>

      {/* Chat Overlay */}
      {activeChat && (
        <ChatInterface 
          session={activeChat} 
          currentUserRole={role}
          onClose={() => setActiveChat(null)}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default App;
