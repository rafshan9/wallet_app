import { View, ScrollView } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import TopBar from '../../components/TopBar'
import CardSlider from '../../components/CardComponents/CardSlider';
import RecentActivity from '../../components/RecentActivity';
import InsightCard from '../../components/CardComponents/InsightCard';
import NotesCard from '../../components/NoteComponents/NotesCard';
import PlannedPaymentsCard from '../../components/PlannedPaymentComponents/PlannedPaymentsCard';
import AddPlannedPaymentModal from '../../components/PlannedPaymentComponents/AddPlannedPaymentModal';
import { usePlannedPayments } from '../../hooks/usePlannedPayments';
import { useAlert } from '../../components/AlertModal';
import { useNotes, Note } from '../../hooks/useNotes';
import { useAppStore } from '../../store';

export default function HomeScreen() {
  const router = useRouter();
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

  // Notes — the modal itself now lives in FAB.tsx, this just triggers it via the store
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

  return (
    <View className="flex-1 relative bg-background pt-16 ">
      <View className="px-6">
        <TopBar />
      </View>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <CardSlider />
        <View className="px-6">
          <RecentActivity />
          <InsightCard />
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
    </View>
  );
}