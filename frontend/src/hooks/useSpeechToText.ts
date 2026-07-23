import { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

export function useSpeechToText(onResult: (text: string) => void) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const finalizedTextRef = useRef(''); // Tracks permanent text

    useSpeechRecognitionEvent('start', () => {
        setIsRecording(true);
        finalizedTextRef.current = '';
    });

    useSpeechRecognitionEvent('result', (event) => {
        const text = event.results[0]?.transcript;
        if (text) {
            // Combine permanent text with the live interim speech
            const currentLiveText = finalizedTextRef.current
                ? `${finalizedTextRef.current} ${text}`
                : text;

            if (event.isFinal) {
                finalizedTextRef.current = currentLiveText;
            }

            // Stream the live text immediately to your UI
            onResult(currentLiveText);
        }
    });

    useSpeechRecognitionEvent('end', () => {
        setIsRecording(false);
        setIsProcessing(false);
    });

    useSpeechRecognitionEvent('error', (event) => {
        setIsRecording(false);
        setIsProcessing(false);
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
            Alert.alert('Error', 'Could not recognize speech. Try again.');
        }
    });

    const startRecording = useCallback(async () => {
        const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!result.granted) {
            Alert.alert('Permission needed', 'Microphone permission denied');
            return;
        }
        finalizedTextRef.current = '';
        ExpoSpeechRecognitionModule.start({
            lang: 'en-US',
            interimResults: true, // Required for live updates
            continuous: true,
        });
    }, []);

    const stopRecording = useCallback(() => {
        setIsProcessing(true);
        ExpoSpeechRecognitionModule.stop();
    }, []);

    return { isRecording, isProcessing, startRecording, stopRecording };
}