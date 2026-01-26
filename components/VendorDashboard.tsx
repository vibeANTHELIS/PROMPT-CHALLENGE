import React, { useState } from 'react';
import { Listing, Language } from '../types';
import VoiceInput from './VoiceInput';
import PriceWidget from './PriceWidget';
import ListingCard from './ListingCard';
import { extractListingDetails, translateText } from '../services/geminiService';
import { Loader2, Plus, ArrowLeft } from 'lucide-react';

interface VendorDashboardProps {
  listings: Listing[];
  onAddListing: (listing: Listing) => void;
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ listings, onAddListing }) => {
  const [view, setView] = useState<'home' | 'create'>('home');
  const [processing, setProcessing] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  
  // State for the confirmation step
  const [draftListing, setDraftListing] = useState<Partial<Listing> | null>(null);

  const handleTranscript = async (text: string, lang: Language) => {
    setProcessing(true);
    setVoiceText(text);

    // 1. Translate to English for structured extraction
    const translatedText = lang === 'en' ? text : await translateText(text, 'en');
    
    // 2. Extract details
    const details = await extractListingDetails(translatedText);

    if (details) {
      setDraftListing({
        item: details.item || 'Produce',
        quantity: details.quantity || 'N/A',
        price: details.price || 0,
        category: details.category || 'Other',
        description: {
          original: text,
          translated: translatedText,
          language: lang
        },
        vendorName: "You (Farmer)",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'active',
        currency: 'INR'
      });
    }
    setProcessing(false);
    setView('create');
  };

  const confirmListing = () => {
    if (draftListing) {
      const newListing = {
        ...draftListing,
        id: crypto.randomUUID(),
      } as Listing;
      onAddListing(newListing);
      setDraftListing(null);
      setVoiceText("");
      setView('home');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Namaste, Kisan!</h1>
          <p className="text-gray-500">Sell your produce easily.</p>
        </div>
        {view === 'home' && (
          <button 
            onClick={() => setView('create')}
            className="bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-orange-600"
          >
            <Plus className="w-6 h-6" />
          </button>
        )}
      </header>

      {view === 'home' ? (
        <>
          {/* Price Discovery Widget */}
          <section>
            <PriceWidget />
          </section>

          {/* Quick Voice Add */}
          <section className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-sm border border-green-200 text-center">
            <h3 className="font-bold text-green-900 mb-2">Speak to Sell</h3>
            <p className="text-sm text-green-700 mb-4">"I have 50kg tomatoes for 30 rupees..."</p>
            <VoiceInput onTranscript={handleTranscript} isProcessing={processing} />
          </section>

          {/* My Listings */}
          <section>
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Your Listings</h3>
            {listings.length === 0 ? (
              <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                No listings yet. Tap the mic!
              </div>
            ) : (
              <div className="grid gap-4">
                {listings.map(l => (
                  <ListingCard 
                    key={l.id} 
                    listing={l} 
                    viewerRole="vendor" 
                    onChat={() => {}} 
                  />
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        /* Create Listing Flow */
        <div className="bg-white rounded-xl p-6 shadow-sm min-h-[50vh]">
          <button 
            onClick={() => setView('home')}
            className="flex items-center text-gray-500 mb-6 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Cancel
          </button>

          {!draftListing && !processing && (
             <div className="text-center py-10">
               <VoiceInput onTranscript={handleTranscript} isProcessing={processing} />
             </div>
          )}

          {processing && (
            <div className="flex flex-col items-center justify-center py-20 text-orange-500">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p>Analyzing voice input...</p>
            </div>
          )}

          {draftListing && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900">Confirm Details</h2>
              
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <label className="text-xs text-gray-500 block mb-1">Original Voice</label>
                  <p className="text-gray-800 italic">"{voiceText}"</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Item</label>
                    <input 
                      type="text" 
                      value={draftListing.item} 
                      onChange={(e) => setDraftListing({...draftListing, item: e.target.value})}
                      className="w-full p-2 border rounded font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Price (₹)</label>
                    <input 
                      type="number" 
                      value={draftListing.price} 
                      onChange={(e) => setDraftListing({...draftListing, price: Number(e.target.value)})}
                      className="w-full p-2 border rounded font-medium"
                    />
                  </div>
                </div>
                 
                <div>
                   <label className="text-xs text-gray-500 block mb-1">Quantity</label>
                    <input 
                      type="text" 
                      value={draftListing.quantity} 
                      onChange={(e) => setDraftListing({...draftListing, quantity: e.target.value})}
                      className="w-full p-2 border rounded font-medium"
                    />
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <label className="text-xs text-blue-500 block mb-1">English Translation (Auto)</label>
                  <p className="text-blue-900">{draftListing.description?.translated}</p>
                </div>
              </div>

              <button 
                onClick={confirmListing}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-700 shadow-md"
              >
                Post Listing
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;