import { View, ScrollView, Animated, useWindowDimensions } from 'react-native';
import { useState, useCallback, useRef } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import TopBar from '../../components/TopBar'
import CardSlider from '../../components/CardComponents/CardSlider';
import NotesCard from '../../components/NoteComponents/NotesCard';
import PlannedPaymentsCard from '../../components/PlannedPaymentComponents/PlannedPaymentsCard';
import AddPlannedPaymentModal from '../../components/PlannedPaymentComponents/AddPlannedPaymentModal';
import { usePlannedPayments } from '../../hooks/usePlannedPayments';
import { useAlert } from '../../components/AlertModal';
import { useNotes, Note } from '../../hooks/useNotes';
import { useAppStore } from '../../store';
import { CARD_BACKGROUND_COLORS } from '../../constants/cardColors';

export default function HomeScreen() {
  const router = useRouter();
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { upcoming, totalDueThisWeek, fetchPayments } = usePlannedPayments();
  const { notes, deleteNote } = useNotes();
  const { openNoteModal } = useAppStore();
  const showAlert = useAlert();

  useFocusEffect(
    useCallback(() => {
      fetchPayments();
    }, [fetchPayments])
  );

  const handlePressPayment = (id: string) => router.push(`/planned-payment/${id}`);
  const handleAddPress = () => setIsAddModalOpen(true);
  const handleViewAll = () => router.push('/planned-payment');

  const handleAddNotePress = () => openNoteModal();
  const handleEditNotePress = (note: Note) => openNoteModal(note);
  const handleDeleteNotePress = (note: Note) => {
    showAlert({
      title: 'Delete note',
      message: "This can't be undone.",
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteNote(note.id) },
      ],
    });
  };

  const inputRange = [0, SCREEN_WIDTH, SCREEN_WIDTH * 2];
  const animatedHeroColor = scrollX.interpolate({
    inputRange,
    outputRange: CARD_BACKGROUND_COLORS,
  });

  return (
    <Animated.View className="flex-1 relative" style={{ backgroundColor: animatedHeroColor }}>
      <View style={{ paddingTop: 64 }}>
        <TopBar />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <CardSlider scrollX={scrollX} />
        <View className="px-6">
          <PlannedPaymentsCard
            payments={upcoming}
            totalDueThisWeek={totalDueThisWeek}
            onPressPayment={handlePressPayment}
            onAddPress={handleAddPress}
            onViewAll={handleViewAll}
          />
          <NotesCard
            notes={notes}
            onAddPress={handleAddNotePress}
            onEditPress={handleEditNotePress}
            onDeletePress={handleDeleteNotePress}
          />
        </View>
      </ScrollView>

      <AddPlannedPaymentModal
        visible={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchPayments();
        }}
      />
    </Animated.View>
  );
}