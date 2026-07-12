import { View } from 'react-native';
import Navbar, { TabBarProps } from './Navbar';
import FAB from './FAB';

export default function CustomTabBar({ state, navigation }: TabBarProps) {
    return (
        <View
            className="absolute bottom-12 left-6 right-6 flex-row justify-between items-center"
            pointerEvents="box-none"
        >
            <Navbar state={state} navigation={navigation} />
            <FAB />
        </View>
    );
}