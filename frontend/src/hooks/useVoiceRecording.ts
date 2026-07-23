import {
    useAudioRecorder,
    useAudioRecorderState,
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
} from 'expo-audio';
import { useState } from 'react';
import api from '../../utils/axios';
import { useAlert } from '../components/AlertModal';

export const useVoiceRecording = (
    endpoint: string,
    onRecordingComplete: (expenses: { name: string; amount: number; category: string }[]) => void
) => {
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(audioRecorder);
    const [isProcessing, setIsProcessing] = useState(false);
    const showAlert = useAlert();

    async function startRecording() {
        try {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
                showAlert({ title: 'Permission needed', message: 'Microphone permission denied' });
                return;
            }
            await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
            await audioRecorder.prepareToRecordAsync();
            audioRecorder.record();
        } catch (err) {
            console.error('Failed to start recording', err);
            showAlert({ title: 'Error', message: 'Could not start recording' });
        }
    }

    async function stopRecording() {
        if (!recorderState.isRecording) return;
        await audioRecorder.stop();

        const uri = audioRecorder.uri;
        if (!uri) return;

        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('audio', {
                uri,
                name: 'recording.m4a',
                type: 'audio/m4a',
            } as any);

            const { data } = await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            onRecordingComplete(data.expenses ?? data);
        } catch (err: any) {
            const message = err.response?.data?.error ?? '';
            if (err.response?.status === 429 || message.includes('RESOURCE_EXHAUSTED')) {
                showAlert({ title: 'Busy right now', message: 'Voice transcription is temporarily unavailable. Please try again in a bit.' });
            } else {
                showAlert({ title: 'Error', message: 'Could not transcribe recording' });
            }
            console.error('Failed to process recording', err.response?.data ?? err.message);
        } finally {
            setIsProcessing(false);
        }
    }

    return {
        isRecording: recorderState.isRecording,
        isProcessing,
        startRecording,
        stopRecording,
    };
};