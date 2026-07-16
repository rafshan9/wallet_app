import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Note } from '../../hooks/useNotes';

type Props = {
    notes: Note[];
    onAddPress: () => void;
    onEditPress: (note: Note) => void;
    onDeletePress: (note: Note) => void;
};

export default function NotesCard({ notes, onAddPress, onEditPress, onDeletePress }: Props) {
    return (
        <View className="bg-dark_blue rounded-3xl p-5 mb-8 border-2 border-dashed border-background">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="font-rubik_bold text-lg text-white">Notes</Text>
                <Text className="font-rubik_medium text-xs text-white/60">
                    {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </Text>
            </View>

            {notes.length === 0 ? (
                <Text className="text-white/60 font-rubik_medium text-center py-4">No notes yet.</Text>
            ) : (
                notes.map((note) => (
                    <View key={note.id} className="flex-row items-start py-3 border-t border-white/10">
                        <View className="w-2 h-2 rounded-full bg-white/60 mt-2 mr-3" />
                        <Text className="flex-1 font-rubik_medium text-sm text-white pr-2">{note.content}</Text>
                        <TouchableOpacity onPress={() => onEditPress(note)} hitSlop={8} className="ml-2">
                            <Feather name="edit-2" size={14} color="white" style={{ opacity: 0.6 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onDeletePress(note)} hitSlop={8} className="ml-3">
                            <Feather name="trash-2" size={14} color="white" style={{ opacity: 0.6 }} />
                        </TouchableOpacity>
                    </View>
                ))
            )}

            <TouchableOpacity onPress={onAddPress} className="mt-4 bg-white py-3 rounded-full items-center">
                <Text className="text-dark_blue font-rubik_bold text-md">Add Note</Text>
            </TouchableOpacity>
        </View>
    );
}