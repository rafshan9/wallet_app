import { View } from 'react-native';
import Navbar, { TabBarProps } from './Navbar';
import FAB from './FAB';

export default function CustomTabBar({ state, navigation }: TabBarProps) {
    return (
        <View
            className="absolute bottom-12 left-0 right-0 flex-row justify-center items-center"
            pointerEvents="box-none"
        >
            <Navbar state={state} navigation={navigation} />
            <FAB />
        </View>
    );
}