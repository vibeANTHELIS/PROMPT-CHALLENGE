import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Globe } from 'lucide-react';
import { ChatSession, Message, Language } from '../types';
import { translateText } from '../services/geminiService';

interface ChatInterfaceProps {
  session: ChatSession;
  currentUserRole: 'vendor' | 'buyer';
  onClose: () => void;
  onSendMessage: (sessionId: string, text: string, translation: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  session, 
  currentUserRole, 
  onClose,
  onSendMessage 
}) => {
  const [inputText, setInputText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Target language logic: If I am buyer (English pref), vendor speaks Hindi?
  // For this demo, let's assume Vendor = Hindi/Tamil, Buyer = English.
  const myLang: Language = currentUserRole === 'vendor' ? 'hi' : 'en'; 
  const otherLang: Language = currentUserRole === 'vendor' ? 'en' : 'hi';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    setIsTranslating(true);
    const original = inputText;
    setInputText(""); // Clear immediately for UX

    // Translate to the *other* person's language
    const translatedText = await translateText(original, otherLang);
    
    onSendMessage(session.id, original, translatedText);
    setIsTranslating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white sm:max-w-md sm:right-0 sm:left-auto sm:border-l shadow-2xl animate-slide-in">
      {/* Header */}
      <div className="bg-orange-500 p-4 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
            {currentUserRole === 'vendor' ? 'B' : 'V'}
          </div>
          <div>
            <h3 className="font-bold">{currentUserRole === 'vendor' ? 'Buyer' : 'Farmer'}</h3>
            <p className="text-xs opacity-90 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Auto-translating
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {session.messages.map((msg) => {
          const isMe = (msg.senderId === currentUserRole);
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                  isMe 
                    ? 'bg-orange-100 text-gray-800 rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}
              >
                {/* Primary Text (My Language preference) */}
                <p className="text-sm font-medium">
                  {currentUserRole === 'vendor' 
                    ? (msg.text.language !== 'en' ? msg.text.original : msg.text.translated) 
                    : (msg.text.language === 'en' ? msg.text.original : msg.text.translated)
                  }
                </p>
                
                {/* Secondary Text (Original if translated, or translated if original) */}
                <div className="mt-1 pt-1 border-t border-black/5 text-xs text-gray-500 italic">
                  {currentUserRole === 'vendor' 
                    ? (msg.text.language === 'en' ? msg.text.original : msg.text.translated)
                    : (msg.text.language !== 'en' ? msg.text.original : msg.text.translated)
                  }
                </div>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          );
        })}
        {isTranslating && (
           <div className="flex items-center gap-2 text-xs text-gray-400 p-2">
             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
             Translating...
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Type in ${myLang === 'hi' ? 'Hindi/English' : 'English'}...`}
            className="flex-1 bg-transparent outline-none text-sm text-gray-800"
            disabled={isTranslating}
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || isTranslating}
            className="p-2 bg-green-600 rounded-full text-white disabled:opacity-50 hover:bg-green-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
