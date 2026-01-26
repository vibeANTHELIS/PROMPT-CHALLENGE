import React, { useState } from 'react';
import { Listing } from '../types';
import ListingCard from './ListingCard';
import { Search, MapPin } from 'lucide-react';

interface BuyerDashboardProps {
  listings: Listing[];
  onChat: (listing: Listing) => void;
}

const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ listings, onChat }) => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredListings = listings.filter(l => {
    const query = search.toLowerCase();
    const matchesSearch = (
      l.item.toLowerCase().includes(query) ||
      l.description.translated.toLowerCase().includes(query) ||
      l.description.original.toLowerCase().includes(query)
    );
    
    // If category is 'All', match everything.
    // If category is undefined in the listing (old data), only match if 'All' is selected.
    // Otherwise match strict equality.
    const matchesCategory = selectedCategory === 'All' || l.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-20">
      <header>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Fresh Produce</h1>
          <div className="flex items-center text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            <MapPin className="w-3 h-3 mr-1 text-orange-500" />
            <span>Local Mandi</span>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search onions, rice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-orange-500 bg-white"
          />
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
        </div>
      </header>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['All', 'Vegetables', 'Fruits', 'Grains'].map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === cat 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredListings.length > 0 ? (
          filteredListings.map(l => (
            <ListingCard 
              key={l.id} 
              listing={l} 
              viewerRole="buyer" 
              onChat={onChat}
            />
          ))
        ) : (
          <div className="text-center py-12">
             <div className="inline-block p-4 rounded-full bg-gray-50 mb-3">
               <Search className="w-6 h-6 text-gray-400" />
             </div>
             <p className="text-gray-500 font-medium">No produce found</p>
             <p className="text-sm text-gray-400">Try changing the category or search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;