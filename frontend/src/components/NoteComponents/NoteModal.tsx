import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useAlert } from '../AlertModal';
import { Note, useAddVoiceNote } from '../../hooks/useNotes'; // Import the new mutation
import { useVoiceRecording } from '../../hooks/useVoiceRecording';

type Props = {
    visible: boolean;
    note: Note | null;
    onClose: () => void;
    onSave: (content: string) => Promise<void>;
};

export default function NoteModal({ visible, note, onClose, onSave }: Props) {
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const showAlert = useAlert();

    // 1. Initialize the mutation
    const { mutate: addVoiceNote } = useAddVoiceNote();

    // 2. Wire up the decoupled hook
    const { isRecording, startRecording, stopRecording } = useVoiceRecording((uri) => {
        // Instantly hide the modal
        onClose();

        const formData = new FormData();
        formData.append('audio', { uri, name: 'recording.m4a', type: 'audio/m4a' } as any);

        // Optional: Send typed text along with the audio if they typed before recording
        if (content.trim()) {
            formData.append('text', content.trim());
        }

        // Fire the background process
        addVoiceNote(formData);
    });

    useEffect(() => {
        setContent(note?.content ?? '');
    }, [note, visible]);

    const handleSave = async () => {
        if (!content.trim()) {
            showAlert({ title: 'Empty note', message: 'Write something before saving.' });
            return;
        }
        setIsSaving(true);
        try {
            await onSave(content.trim());
            onClose();
        } catch (error) {
            console.error('Failed to save note', error);
            showAlert({ title: 'Something went wrong', message: 'Could not save this note. Try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView behavior="padding" className="flex-1">
                <View className="flex-1 justify-end bg-black/40">
                    <View className="bg-very_dark_blue rounded-t-[32px] border-2 border-black px-6 pt-6 pb-8">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="font-inter_bold text-xl text-white">{note ? 'Edit Note' : 'New Note'}</Text>
                            <TouchableOpacity className="bg-yellow rounded-full p-2 border-2 border-black" onPress={onClose} hitSlop={8}>
                                <Feather name="x" size={22} color="black" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            value={content}
                            onChangeText={setContent}
                            placeholder="Write a note..."
                            placeholderTextColor="rgba(255,255,255,0.6)"
                            multiline
                            numberOfLines={4}
                            autoFocus
                            className="border-2 border-white/30 text-white rounded-2xl px-4 py-3 font-inter_medium mb-6"
                            style={{ minHeight: 100, textAlignVertical: 'top' }}
                        />

                        <View className="flex-row items-center gap-3">
                            {/* Removed disabled state and ActivityIndicator */}
                            <TouchableOpacity
                                onPress={isRecording ? stopRecording : startRecording}
                                className={`h-14 w-14 rounded-full items-center justify-center border-2 border-black ${isRecording ? 'bg-red' : 'bg-yellow'
                                    }`}
                            >
                                <Feather name={isRecording ? "square" : "mic"} size={20} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} disabled={isSaving} className="flex-1 bg-black py-4 rounded-full items-center">
                                <Text className="text-white font-inter_bold">{isSaving ? 'Saving...' : 'Save Note'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}