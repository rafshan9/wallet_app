import {
    useAudioRecorder,
    useAudioRecorderState,
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
} from 'expo-audio';
import { Alert } from 'react-native';

export const useVoiceRecording = (onRecordingComplete: (uri: string) => void) => {
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const recorderState = useAudioRecorderState(audioRecorder);

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

        if (audioRecorder.uri) {
            onRecordingComplete(audioRecorder.uri);
        }
    }

    return {
        isRecording: recorderState.isRecording,
        startRecording,
        stopRecording,
    };
};