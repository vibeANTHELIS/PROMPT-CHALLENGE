import React, { useState, useRef } from 'react';
import { Mic, Globe, RefreshCcw } from 'lucide-react';
import { VOICE_SIMULATION_SAMPLES, SUPPORTED_LANGUAGES } from '../constants';
import { Language } from '../types';

interface VoiceInputProps {
  onTranscript: (text: string, lang: Language) => void;
  isProcessing: boolean;
}

// Persist simulation index globally
let globalSimulationIndex = 0;

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>('hi');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (isProcessing || isRecording) return;

    setIsRecording(true);

    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      // --- Real Speech Recognition ---
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = false; // Stop after one sentence/phrase
      recognition.interimResults = false;
      recognition.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        onTranscript(transcript, selectedLang);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
        // Fallback to simulation if audio capture is not allowed or fails
        if (event.error === 'not-allowed' || event.error === 'no-speech') {
          // Optional: You could trigger simulation here automatically, 
          // but usually better to let user try again or handle explicitly.
          alert("Could not access microphone. Please check permissions.");
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();

    } else {
      // --- Fallback Simulation ---
      // Requirement: Improve voice recognition & Give more time
      // We simulate a longer listening period (4 seconds)
      
      setTimeout(() => {
        // Filter samples to match selected language
        const relevantSamples = VOICE_SIMULATION_SAMPLES.filter(s => s.lang === selectedLang);
        
        // Pick next sample in sequence, wrapping around if needed
        const sample = relevantSamples[globalSimulationIndex % relevantSamples.length];
        
        setIsRecording(false);
        onTranscript(sample.text, sample.lang);
        
        globalSimulationIndex++;
      }, 4000); // Increased from 2000ms to 4000ms
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      {/* Language Selector */}
      <div className="flex bg-white rounded-full p-1 border border-gray-200 mb-6 shadow-sm">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => !isRecording && setSelectedLang(lang.code)}
            disabled={isRecording}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1
              ${selectedLang === lang.code 
                ? 'bg-orange-100 text-orange-700 shadow-sm ring-1 ring-orange-200' 
                : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            {selectedLang === lang.code && <Globe className="w-3 h-3" />}
            {lang.nativeName}
          </button>
        ))}
      </div>

      {/* Mic Button */}
      <div className="relative">
        <button
          onClick={isRecording ? stopListening : startListening}
          disabled={isProcessing}
          className={`
            relative flex items-center justify-center w-24 h-24 rounded-full 
            transition-all duration-300 shadow-xl border-4
            ${isRecording 
              ? 'bg-red-500 border-red-100 scale-110' 
              : 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-100 hover:scale-105'}
            disabled:opacity-70 disabled:cursor-not-allowed
          `}
        >
          {isRecording ? (
            <div className="flex gap-1 h-5 items-center">
               <div className="w-1.5 h-full bg-white animate-music-bar-1 rounded-full"></div>
               <div className="w-1.5 h-full bg-white animate-music-bar-2 rounded-full"></div>
               <div className="w-1.5 h-full bg-white animate-music-bar-3 rounded-full"></div>
            </div>
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
          
          {/* Ripple Effect */}
          {isRecording && (
            <>
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20 animate-ping delay-75"></span>
              <span className="absolute inline-flex h-[120%] w-[120%] rounded-full bg-red-400 opacity-10 animate-pulse"></span>
            </>
          )}
        </button>
      </div>
      
      <div className="mt-6 text-center min-h-[3rem]">
        <p className={`font-semibold text-lg ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
          {isRecording 
            ? "Listening..." 
            : isProcessing 
              ? "Processing..." 
              : "Tap to Speak"}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {isRecording 
            ? `Speaking in ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.name}` 
            : "Describe your produce, quantity, and price"}
        </p>
      </div>

      <style>{`
        @keyframes music-bar-1 { 0%, 100% { height: 40%; } 50% { height: 100%; } }
        @keyframes music-bar-2 { 0%, 100% { height: 60%; } 50% { height: 30%; } }
        @keyframes music-bar-3 { 0%, 100% { height: 40%; } 50% { height: 80%; } }
        .animate-music-bar-1 { animation: music-bar-1 1s infinite ease-in-out; }
        .animate-music-bar-2 { animation: music-bar-2 0.8s infinite ease-in-out; }
        .animate-music-bar-3 { animation: music-bar-3 1.2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default VoiceInput;