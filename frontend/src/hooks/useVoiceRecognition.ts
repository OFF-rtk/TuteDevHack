// src/hooks/useVoiceRecognition.ts

export const mockWhisperAPI = (audioBlob: Blob): Promise<string> => {
    console.log("Simulating OpenAI Whisper API call with audio blob:", audioBlob);
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockTranscript = "order five kilos of onions";
            console.log("Mock Whisper API returned:", mockTranscript);
            resolve(mockTranscript);
        }, 1500); // Simulate network latency
    });
};