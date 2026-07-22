import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Note } from '../../hooks/useNotes';

// Sub-component to manage animation state for each note independently
const NoteItem = ({
    note,
    onEditPress,
    onDeletePress
}: {
    note: Note;
    onEditPress: (note: Note) => void;
    onDeletePress: (note: Note) => void;
}) => {
    const isTranscribing = String(note.id).startsWith('temp-');
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isTranscribing) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(fadeAnim, { toValue: 0.4, duration: 500, useNativeDriver: true }),
                    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                ])
            ).start();
        } else {
            fadeAnim.setValue(1);
        }
    }, [isTranscribing]);

    return (
        <Animated.View
            style={{ opacity: fadeAnim }}
            className="flex-row items-start py-3 border-t border-white/10"
        >
            {/* Swap the standard dot for a red one when transcribing */}
            {isTranscribing ? (
                <View className="w-2 h-2 rounded-full bg-red mt-2 mr-3" />
            ) : (
                <View className="w-2 h-2 rounded-full bg-white/60 mt-2 mr-3" />
            )}

            <Text className="flex-1 font-inter_medium text-lg text-white pr-2">
                {note.content}
            </Text>

            {/* Hide interaction buttons so they can't be pressed during upload */}
            {!isTranscribing && (
                <>
                    <TouchableOpacity onPress={() => onEditPress(note)} hitSlop={8} className="ml-2">
                        <Feather name="edit-2" size={14} color="white" style={{ opacity: 0.6 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDeletePress(note)} hitSlop={8} className="ml-3">
                        <Feather name="trash-2" size={14} color="white" style={{ opacity: 0.6 }} />
                    </TouchableOpacity>
                </>
            )}
        </Animated.View>
    );
};

type Props = {
    notes: Note[];
    onAddPress: () => void;
    onEditPress: (note: Note) => void;
    onDeletePress: (note: Note) => void;
};

export default function NotesCard({ notes, onAddPress, onEditPress, onDeletePress }: Props) {
    return (
        <View className="mt-2">
            <View className="bg-black rounded-3xl p-5 mb-8">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="font-inter_bold text-lg text-white">Notes</Text>
                    <Text className="font-inter_medium text-xs text-white/60">
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                    </Text>
                </View>

                {notes.length === 0 ? (
                    <Text className="text-white/60 font-inter_medium text-center py-4">No notes yet.</Text>
                ) : (
                    notes.map((note) => (
                        <NoteItem
                            key={note.id}
                            note={note}
                            onEditPress={onEditPress}
                            onDeletePress={onDeletePress}
                        />
                    ))
                )}

                <TouchableOpacity onPress={onAddPress} className="mt-4 bg-white py-3 rounded-full items-center">
                    <Text className="text-black font-inter_bold text-md">Add Note</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}