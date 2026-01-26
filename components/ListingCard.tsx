import React from 'react';
import { Listing, Language } from '../types';
import { MessageCircle, ShoppingBag } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  viewerRole: 'vendor' | 'buyer';
  onChat: (listing: Listing) => void;
  onEdit?: (listing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, viewerRole, onChat }) => {
  // If viewer is Buyer, show English (translated) primarily.
  // If vendor, show Original.
  
  const primaryText = viewerRole === 'buyer' ? listing.description.translated : listing.description.original;
  const secondaryText = viewerRole === 'buyer' ? listing.description.original : listing.description.translated;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 capitalize">{listing.item}</h3>
            <p className="text-sm text-gray-500">{listing.quantity} • {listing.vendorName}</p>
          </div>
          <div className="bg-green-50 px-3 py-1 rounded-full border border-green-100">
            <span className="font-bold text-green-700">₹{listing.price}</span>
          </div>
        </div>

        <div className="space-y-2 my-3">
          <p className="text-gray-800 text-sm leading-relaxed">
            {primaryText}
          </p>
          <p className="text-gray-400 text-xs italic border-l-2 border-gray-200 pl-2">
            {secondaryText}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400">
            {new Date(listing.createdAt).toLocaleDateString()}
          </span>
          
          {viewerRole === 'buyer' ? (
            <div className="flex gap-2">
               <button 
                onClick={() => onChat(listing)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200"
              >
                <MessageCircle className="w-4 h-4" />
                Negotiate
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                <ShoppingBag className="w-4 h-4" />
                Buy
              </button>
            </div>
          ) : (
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">
              {listing.status === 'active' ? 'Active' : 'Sold'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
