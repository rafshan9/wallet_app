import { useMemo } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, Animated } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { Transaction } from '../../hooks/useCashFlow';

interface ActivityBlockProps {
    item: Transaction;
    IconComponent: React.FC<SvgProps>;
    scrollX: Animated.Value;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

export function ActivityBlock({ item, IconComponent, scrollX }: ActivityBlockProps) {
    const { width } = useWindowDimensions();
    const AnimatedIcon = useMemo(
        () => Animated.createAnimatedComponent(IconComponent),
        [IconComponent]
    );

    const backgroundColor = scrollX.interpolate({
        inputRange: [0, width, width * 2],
        outputRange: ['#1A1831', '#000000', '#161E54'],
        extrapolate: 'clamp'
    });

    const contentColor = scrollX.interpolate({
        inputRange: [0, width, width * 2],
        outputRange: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
        extrapolate: 'clamp'
    });



    return (
        <Animated.View
            className="w-[48%] aspect-square rounded-3xl p-7 justify-center mb-4"
            style={{ backgroundColor }}
        >
            <AnimatedIcon
                width={48}
                height={48}
                style={{ marginBottom: 16 }}
            />

            <View>
                <AnimatedText
                    className="font-alfa text-xl capitalize"
                    style={{ color: contentColor }}
                    numberOfLines={1}
                >
                    {item.category.toLowerCase()}
                </AnimatedText>
                <AnimatedText
                    className="font-alfa text-3xl mt-2"
                    style={{ color: contentColor }}
                >
                    ${Math.floor(Number(item.amount))}
                </AnimatedText>
            </View>
        </Animated.View>
    );
}