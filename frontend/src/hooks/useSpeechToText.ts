import { useState, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

export function useSpeechToText(onFinalResult?: (text: string) => void) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const finalTextRef = useRef('');

    useSpeechRecognitionEvent('start', () => {
        finalTextRef.current = '';
        setTranscript('');
        setIsRecording(true);
    });

    useSpeechRecognitionEvent('result', (event) => {
        const text = event.results[0]?.transcript ?? '';
        if (!text) return;

        if (event.isFinal) {
            finalTextRef.current = finalTextRef.current ? `${finalTextRef.current} ${text}` : text;
            setTranscript(finalTextRef.current);
        } else {
            // live preview: locked-in text so far + current in-progress guess
            setTranscript(finalTextRef.current ? `${finalTextRef.current} ${text}` : text);
        }
    });

    useSpeechRecognitionEvent('end', () => {
        setIsRecording(false);
        if (onFinalResult && finalTextRef.current.trim()) {
            onFinalResult(finalTextRef.current.trim());
        }
    });

    useSpeechRecognitionEvent('error', (event) => {
        setIsRecording(false);
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
        ExpoSpeechRecognitionModule.start({
            lang: 'en-US',
            interimResults: true,
            continuous: true,
        });
    }, []);

    const stopRecording = useCallback(() => {
        ExpoSpeechRecognitionModule.stop();
    }, []);

    return { isRecording, transcript, setTranscript, startRecording, stopRecording };
}