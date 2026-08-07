import { useState, useRef, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';
import { initWhisper, WhisperContext } from 'whisper.rn';

export function useSpeechToText(onFinalResult?: (text: string) => void) {
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState('');

    const whisperCtxRef = useRef<WhisperContext | null>(null);
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

    // 1. Initialize Whisper offline model on mount
    useEffect(() => {
        let isMounted = true;
        async function loadModel() {
            try {
                // Initialize context with the ggml model
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

    // 2. Start Recording via expo-audio
    const handleStart = useCallback(async () => {
        try {
            // Check permissions using expo-audio's module
            const permission = await AudioModule.requestRecordingPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permission needed', 'Microphone permission denied');
                return;
            }

            setTranscript('');

            // Start recording
            audioRecorder.record();
        } catch (error) {
            Alert.alert('Error', 'Failed to start recording');
            console.error(error);
        }
    }, [audioRecorder]);

    // 3. Stop Recording & Transcribe Offline
    const handleStop = useCallback(async () => {
        if (!audioRecorder.isRecording) return;

        try {
            setIsTranscribing(true);

            // Stop recording
            await audioRecorder.stop();
            const uri = audioRecorder.uri;
            
            if (!uri) {
                console.error("Recording stopped but no URI was produced.");
                return;
            }

            console.log('Recording stopped at URI:', uri);

            if (whisperCtxRef.current) {
                function toWhisperFileUri(u: string): string {
                    return u.replace(/^file:\/+/, 'file:///');
                }

                const cleanUri = toWhisperFileUri(uri);
                console.log('Normalized URI:', cleanUri);

                const transcribeResult: any = await whisperCtxRef.current.transcribe(cleanUri, {
                    language: 'en',
                });

                const { result: transcriptionResult } =
                    typeof transcribeResult.then === 'function'
                        ? await transcribeResult          // older API: already a Promise<{result, segments}>
                        : await transcribeResult.promise; // newer API: { stop, promise }

                if (!transcriptionResult || typeof transcriptionResult !== 'string') {
                    console.error("Transcription failed: Result is undefined or not a string.");
                    return;
                }

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
    }, [audioRecorder, onFinalResult]);

    return {
        isRecording: audioRecorder.isRecording,
        isTranscribing,
        transcript,
        setTranscript,
        startRecording: handleStart,
        stopRecording: handleStop,
    };
}
