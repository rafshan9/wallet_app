import { View, ScrollView } from 'react-native';
import TopBar from '../../components/TopBar'
import CardSlider from '../../components/CardComponents/CardSlider';
import RecentActivity from '../../components/RecentActivity';
import InsightCard from '../../components/CardComponents/InsightCard';

export default function HomeScreen() {
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
        </View>
      </ScrollView>
    </View>
  );
}