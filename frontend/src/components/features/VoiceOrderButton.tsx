// src/components/features/VoiceOrderButton.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/stores/appStores';
import { Mic } from 'lucide-react';

export function VoiceOrderButton() {
  const { placeVoiceOrder, isLoading } = useAppStore();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Use a ref to hold the recognition instance
  const recognitionRef = useRef<any>(null);

  // This useEffect runs ONLY on the client-side, after the component mounts.
  useEffect(() => {
    // Check for the SpeechRecognition API here, inside the client environment.
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser.');
      setIsSupported(false);
      return;
    }
    
    setIsSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      setTranscript(currentTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setError(`Error: ${event.error}. Please try again.`);
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;

  }, []); // Empty dependency array ensures this runs only once on mount.

  // This effect runs when listening stops to process the final transcript
  useEffect(() => {
    if (!isListening && transcript) {
      handlePlaceOrder(transcript);
    }
    // This dependency array is correct. We only want to run this when isListening changes to false.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);


  const handleMicClick = () => {
    if (isListening || !recognitionRef.current) {
      return;
    }
    recognitionRef.current.start();
  };

  const handlePlaceOrder = async (finalTranscript: string) => {
    try {
      await placeVoiceOrder(finalTranscript);
      // You could show a success alert here from your store
    } catch (apiError: any) {
      setError(apiError.message || 'Failed to place order.');
    }
  };

  // Don't render the button if the browser doesn't support the feature.
  if (!isSupported) {
    return null; 
  }

  return (
    <>
      <button
        onClick={handleMicClick}
        disabled={isLoading || isListening}
        className="fixed bottom-6 right-6 bg-orange-500 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center z-50 transform transition-transform hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
        aria-label="Place voice order"
      >
        <Mic className="h-8 w-8" />
      </button>

      {/* Listening UI Modal */}
      {isListening && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Listening...</h2>
            <Mic className="h-16 w-16 text-orange-500 mx-auto animate-pulse" />
            <p className="mt-4 text-gray-600 min-h-[2.5em]">{transcript || 'Say something like "I need 5 kg of onions"'}</p>
            <button 
              onClick={() => recognitionRef.current?.stop()}
              className="mt-6 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}