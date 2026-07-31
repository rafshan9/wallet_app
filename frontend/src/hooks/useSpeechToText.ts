// import { useState, useRef, useCallback } from 'react';
// import { Alert } from 'react-native';
// import {
//     ExpoSpeechRecognitionModule,
//     useSpeechRecognitionEvent,
// } from 'expo-speech-recognition';

// export function useSpeechToText(onFinalResult?: (text: string) => void) {
//     const [isRecording, setIsRecording] = useState(false);
//     const [transcript, setTranscript] = useState('');
//     const finalTextRef = useRef('');

//     useSpeechRecognitionEvent('start', () => {
//         finalTextRef.current = '';
//         setTranscript('');
//         setIsRecording(true);
//     });

//     useSpeechRecognitionEvent('result', (event) => {
//         const text = event.results[0]?.transcript ?? '';
//         if (!text) return;

//         if (event.isFinal) {
//             finalTextRef.current = finalTextRef.current ? `${finalTextRef.current} ${text}` : text;
//             setTranscript(finalTextRef.current);
//         } else {
//             // live preview: locked-in text so far + current in-progress guess
//             setTranscript(finalTextRef.current ? `${finalTextRef.current} ${text}` : text);
//         }
//     });

//     useSpeechRecognitionEvent('end', () => {
//         setIsRecording(false);
//         if (onFinalResult && finalTextRef.current.trim()) {
//             onFinalResult(finalTextRef.current.trim());
//         }
//     });

//     useSpeechRecognitionEvent('error', (event) => {
//         setIsRecording(false);
//         if (event.error !== 'no-speech' && event.error !== 'aborted') {
//             Alert.alert('Error', 'Could not recognize speech. Try again.');
//         }
//     });

//     const startRecording = useCallback(async () => {
//         const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
//         if (!result.granted) {
//             Alert.alert('Permission needed', 'Microphone permission denied');
//             return;
//         }
//         ExpoSpeechRecognitionModule.start({
//             lang: 'en-US',
//             interimResults: true,
//             continuous: true,
//         });
//     }, []);

//     const stopRecording = useCallback(() => {
//         ExpoSpeechRecognitionModule.stop();
//     }, []);

//     return { isRecording, transcript, setTranscript, startRecording, stopRecording };
// }


import { useState, useRef, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAudioRecorder } from '@siteed/audio-studio';
import { AudioModule } from 'expo-audio'; // We use expo's standard permission module
import { initWhisper, WhisperContext } from 'whisper.rn';

export function useSpeechToText(onFinalResult?: (text: string) => void) {
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState('');

    const whisperCtxRef = useRef<WhisperContext | null>(null);
    const { startRecording, stopRecording, isRecording } = useAudioRecorder();

    // 1. Initialize Whisper offline model on mount
    useEffect(() => {
        let isMounted = true;
        async function loadModel() {
            try {
                // IMPORTANT: Adjust this relative path based on where this hook file sits
                const ctx = await initWhisper({
                    filePath: require('../../assets/models/ggml-tiny.en.bin'),
                });
                if (isMounted) {
                    whisperCtxRef.current = ctx;
                }
            } catch (error) {
                console.error('Failed to load Whisper model:', error);
            }
        }
        loadModel();

        return () => {
            isMounted = false;
        };
    }, []);

    // 2. Start WAV Recording (16kHz PCM strictly required by Whisper)
    const handleStart = useCallback(async () => {
        try {
            // Check permissions using expo-audio's modern module
            const permission = await AudioModule.requestRecordingPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permission needed', 'Microphone permission denied');
                return;
            }

            setTranscript('');

            // Start hardware-level WAV recording via audio-studio
            await startRecording({
                sampleRate: 16000,
                channels: 1,
                encoding: 'pcm_16bit',
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to start recording');
            console.error(error);
        }
    }, [startRecording]);

    // 3. Stop Recording & Transcribe Offline
    const handleStop = useCallback(async () => {
        if (!isRecording) return;

        try {
            setIsTranscribing(true);

            // Stop hardware recording and get the raw file URI
            const result = await stopRecording();

            if (result?.fileUri && whisperCtxRef.current) {
                // Send the .wav file directly to your local Whisper model
                const { result: transcriptionResult } = await whisperCtxRef.current.transcribe(result.fileUri, {
                    language: 'en',
                });

                const cleanText = transcriptionResult.trim();
                setTranscript(cleanText);

                if (cleanText && onFinalResult) {
                    onFinalResult(cleanText);
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to transcribe audio.');
            console.error(error);
        } finally {
            setIsTranscribing(false);
        }
    }, [isRecording, stopRecording, onFinalResult]);

    return {
        isRecording,
        isTranscribing,
        transcript,
        setTranscript,
        startRecording: handleStart,
        stopRecording: handleStop,
    };
}