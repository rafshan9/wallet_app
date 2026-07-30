import { Tabs, useNavigationContainerRef } from 'expo-router';
import CustomTabBar from '../../components/CustomTabBar';


export default function TabsLayout() {
    const navigationRef = useNavigationContainerRef();

    if (!navigationRef?.isReady()) {
        return null;
    }

    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="CashFlowScreen" />
            <Tabs.Screen name="GoalScreen" />
        </Tabs>
    );
}