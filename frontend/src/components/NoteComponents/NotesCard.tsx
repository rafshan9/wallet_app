import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Note } from '../../hooks/useNotes';

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
            className="flex-row items-center justify-between bg-neutral-900 border-2 border-white p-3.5 mb-3 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
        >
            <View className="flex-row items-center flex-1 mr-3 gap-x-2.5">
                {isTranscribing ? (
                    <View className="w-3 h-3 rounded-full bg-red-500 border border-white" />
                ) : (
                    <View className="w-2.5 h-2.5 rounded-full bg-white" />
                )}

                <Text className="flex-1 font-jb_mono text-sm text-white">
                    {note.content}
                </Text>
            </View>

            {!isTranscribing && (
                <View className="flex-row items-center gap-x-3">
                    <TouchableOpacity onPress={() => onEditPress(note)} hitSlop={8}>
                        <Feather name="edit-2" size={14} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDeletePress(note)} hitSlop={8}>
                        <Feather name="trash-2" size={14} color="white" />
                    </TouchableOpacity>
                </View>
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
        <View className="mt-6 mb-4">
            {/* Category Header */}
            <Text className="font-jb_mono_bold text-xs uppercase tracking-wider text-neutral-500 mb-3">
                NOTES
            </Text>

            {/* Main Black Neo-Brutalist Card */}
            <View className="bg-black border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">

                {/* Header Row */}
                <View className="flex-row justify-between items-center mb-4 pb-3 border-b-2 border-white/20">
                    <Text className="font-jb_mono_bold text-sm text-white uppercase">
                        Active Notes
                    </Text>
                    <Text className="font-jb_mono_bold text-xs text-neutral-400">
                        {notes.length} {notes.length === 1 ? 'NOTE' : 'NOTES'}
                    </Text>
                </View>

                {/* Items List */}
                {notes.length === 0 ? (
                    <Text className="font-jb_mono text-xs text-neutral-400 text-center py-4">
                        No notes yet.
                    </Text>
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

                {/* Add Note Action */}
                <TouchableOpacity
                    onPress={onAddPress}
                    className="mt-2 bg-white border-2 border-white p-3 items-center justify-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
                >
                    <Text className="font-jb_mono_bold text-xs text-black uppercase">
                        + Add Note
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}