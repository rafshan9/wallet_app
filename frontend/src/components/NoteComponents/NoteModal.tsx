import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useAlert } from '../AlertModal';
import { Note } from '../../hooks/useNotes';
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
    const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecording<{ text: string }>(
        '/notes/voice/',
        (data) => {
            setContent((prev) => (prev ? `${prev}\n${data.text}` : data.text));
        }
    );

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

    const handleCameraPress = () => {
        // TODO: wire up camera capture for notes
    };

    const handleVoicePress = () => {
        // TODO: wire up voice-to-text for notes
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior="padding"
                className="flex-1"
            >
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
                            <TouchableOpacity
                                onPress={handleCameraPress}
                                className="h-14 w-14 bg-yellow rounded-full items-center justify-center border-2 border-black"
                            >
                                <Feather name="camera" size={20} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={isRecording ? stopRecording : startRecording}
                                disabled={isProcessing}
                                className={`h-14 w-14 rounded-full items-center justify-center border-2 border-black ${isRecording ? 'bg-red-500' : 'bg-yellow'
                                    }`}
                            >
                                {isProcessing ? (
                                    <ActivityIndicator color="black" />
                                ) : (
                                    <Feather name={isRecording ? "square" : "mic"} size={20} color="black" />
                                )}
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