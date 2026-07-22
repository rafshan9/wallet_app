import { useState } from 'react';
import {
    useAudioRecorder,
    useAudioRecorderState,
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
} from 'expo-audio';
import { Alert } from 'react-native';
import api from '../../utils/axios';

export const useVoiceRecording = <T = any>(endpoint: string, onResult?: (data: T) => void) => {
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(audioRecorder);
    const [isProcessing, setIsProcessing] = useState(false);

    async function startRecording() {
        try {
            const status = await AudioModule.requestRecordingPermissionsAsync();
            if (!status.granted) {
                Alert.alert('Permission needed', 'Microphone permission denied');
                return;
            }
            await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });

            await audioRecorder.prepareToRecordAsync();
            audioRecorder.record();
        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Error', 'Could not start recording');
        }
    }

    async function stopRecording() {
        if (!recorderState.isRecording) return;
        await audioRecorder.stop();

        const uri = audioRecorder.uri;
        if (uri) await uploadAudio(uri);
    }

    async function uploadAudio(uri: string) {
        setIsProcessing(true);
        const formData = new FormData();
        formData.append('audio', { uri, name: 'recording.m4a', type: 'audio/m4a' } as any);

        try {
            const response = await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onResult?.(response.data);
        } catch (error) {
            console.error('Upload error', error);
            Alert.alert('Error', 'Failed to process recording.');
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