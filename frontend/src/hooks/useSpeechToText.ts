import { useState, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { AudioModule, useAudioStream } from 'expo-audio';

export function useSpeechToText(onFinalResult?: (text: string) => void) {
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState('');

    const wsRef = useRef<WebSocket | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    
    // We keep a running transcript internally
    const currentTranscriptRef = useRef('');

    const { stream } = useAudioStream({
        sampleRate: 16000,
        channels: 1,
        encoding: 'int16',
        onBuffer: (buffer) => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                // Send raw PCM ArrayBuffer directly to Deepgram
                wsRef.current.send(buffer.data);
            }
        },
    });

    const handleStart = useCallback(async () => {
        try {
            const permission = await AudioModule.requestRecordingPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permission needed', 'Microphone permission denied');
                return;
            }

            setTranscript('');
            currentTranscriptRef.current = '';
            setIsRecording(true);
            setIsTranscribing(true);

            // Connect WebSocket
            const DEEPGRAM_API_KEY = process.env.EXPO_PUBLIC_DEEPGRAM_API_KEY;
            if (!DEEPGRAM_API_KEY) {
                Alert.alert('Error', 'Deepgram API key not found in .env');
                setIsRecording(false);
                setIsTranscribing(false);
                return;
            }

            const url = 'wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1&interim_results=true';
            
            // React Native / Browser Websocket doesn't allow custom headers, so we pass it in the Protocols array
            const ws = new WebSocket(url, ['token', DEEPGRAM_API_KEY]);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('Deepgram WebSocket connected');
                // Start capturing audio from microphone once WS is open
                stream.start();
            };

            ws.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                    const is_final = response.is_final;
                    const result = response.channel?.alternatives?.[0]?.transcript;
                    
                    if (result) {
                        if (is_final) {
                            currentTranscriptRef.current += result + ' ';
                            setTranscript(currentTranscriptRef.current);
                        } else {
                            setTranscript(currentTranscriptRef.current + result);
                        }
                    }
                } catch (e) {
                    console.error('Error parsing Deepgram message', e);
                }
            };

            ws.onerror = (error) => {
                console.error('Deepgram WebSocket error:', error);
                Alert.alert('Error', 'WebSocket connection failed');
            };

            ws.onclose = () => {
                console.log('Deepgram WebSocket closed');
                setIsTranscribing(false);
            };

        } catch (error) {
            console.error('Recording Error:', error);
            Alert.alert('Error', 'Failed to start recording');
            setIsRecording(false);
            setIsTranscribing(false);
        }
    }, [stream]);

    const handleStop = useCallback(async () => {
        if (!isRecording) return;
        setIsRecording(false);
        
        try {
            stream.stop();
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                // Send CloseStream message to deepgram so it returns the final transcript chunk
                wsRef.current.send(JSON.stringify({ type: 'CloseStream' }));
            }
        } catch (error) {
            console.error(error);
        }
        
        // Wait briefly for final websocket messages then close
        setTimeout(() => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            if (onFinalResult) {
                onFinalResult(currentTranscriptRef.current.trim());
            }
        }, 1000);

    }, [isRecording, stream, onFinalResult]);

    return {
        isRecording,
        isTranscribing,
        transcript,
        setTranscript,
        startRecording: handleStart,
        stopRecording: handleStop,
    };
}
