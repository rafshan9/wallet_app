import { View, TouchableOpacity, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import HouseBlack from '../../assets/icons/house_black.svg';
import HouseWhite from '../../assets/icons/house_white.svg';
import PieWhite from '../../assets/icons/pie_white.svg';
import PieBlack from '../../assets/icons/pie_black.svg';
import GoalBlack from '../../assets/icons/goal_black.svg';
import GoalWhite from '../../assets/icons/goal_white.svg';

const TABS = ['home', 'pie-chart', 'target'] as const;

const ICONS = [
    { Black: HouseBlack, White: HouseWhite },
    { Black: PieBlack, White: PieWhite },
    { Black: GoalBlack, White: GoalWhite },
];

export type TabBarProps = {
    state: {
        index: number;
        routes: { name: string }[];
    };
    navigation: {
        navigate: (name: string) => void;
    };
};

export default function Navbar({ state, navigation }: TabBarProps) {
    const activeIndex = state.index;
    const [barWidth, setBarWidth] = useState(0);

    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: activeIndex,
            useNativeDriver: true,
            bounciness: 8,
        }).start();
    }, [activeIndex]);

    const pillWidth = barWidth * 0.4;
    const tabWidth = (barWidth - 16) / TABS.length;
    const AWAY_SHIFT = 12;

    const getIconShift = (iconIndex: number, active: number) => {
        if (iconIndex === active) {
            if (iconIndex === 0) return 12;
            if (iconIndex === TABS.length - 1) return -12;
            return 0;
        }
        return active > iconIndex ? -AWAY_SHIFT : AWAY_SHIFT;
    };

    return (
        <View
            className="w-72 h-16 bg-black rounded-full flex-row items-center relative mr-4 px-2 "
            onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
        >
            {barWidth > 0 && (
                <Animated.View
                    className="absolute h-12 bg-white rounded-full"
                    style={{
                        width: pillWidth,
                        left: 8,
                        transform: [{
                            translateX: slideAnim.interpolate({
                                inputRange: [0, 1, 2],
                                outputRange: [
                                    0,
                                    (barWidth / 2) - (pillWidth / 2) - 8,
                                    barWidth - pillWidth - 16
                                ],
                            })
                        }]
                    }}
                />
            )}

            {TABS.map((icon, index) => {
                const isActive = activeIndex === index;
                const IconComponent = isActive ? ICONS[index].Black : ICONS[index].White;

                return (
                    <TouchableOpacity
                        key={icon}
                        onPress={() => navigation.navigate(state.routes[index].name)}
                        style={{ width: tabWidth }}
                        className="h-full items-center justify-center z-10"
                        activeOpacity={1}
                    >
                        <Animated.View
                            style={{
                                transform: [{
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 1, 2],
                                        outputRange: [
                                            getIconShift(index, 0),
                                            getIconShift(index, 1),
                                            getIconShift(index, 2),
                                        ]
                                    })
                                }]
                            }}
                        >
                            <IconComponent width={24} height={24} />
                        </Animated.View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}