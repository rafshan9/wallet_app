import { View, ScrollView } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import TopBar from '../../components/TopBar'
import CardSlider from '../../components/CardComponents/CardSlider';
import RecentActivity from '../../components/RecentActivity';
import InsightCard from '../../components/CardComponents/InsightCard';
import PlannedPaymentsCard from '../../components/PlannedPaymentComponents/PlannedPaymentsCard';
import AddPlannedPaymentModal from '../../components/PlannedPaymentComponents/AddPlannedPaymentModal';
import { usePlannedPayments } from '../../hooks/usePlannedPayments';

export default function HomeScreen() {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { upcoming, totalDueThisWeek, fetchPayments } = usePlannedPayments();

  useFocusEffect(
    useCallback(() => {
      fetchPayments();
    }, [fetchPayments])
  );

  const handlePressPayment = (id: string) => router.push(`/planned-payment/${id}`);
  const handleAddPress = () => setIsAddModalOpen(true);
  const handleViewAll = () => router.push('/planned-payment');
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