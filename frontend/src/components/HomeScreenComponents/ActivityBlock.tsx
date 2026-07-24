import { View, Text } from 'react-native';
import { Transaction } from '../../hooks/useCashFlow';

interface ActivityBlockProps {
    item: Transaction;
    color?: string;
    maxWidth?: number;
}

export function ActivityBlock({ item, color = '#4361EE', maxWidth }: ActivityBlockProps) {
    return (
        <View className="self-start" style={maxWidth ? { maxWidth } : undefined}>
            <View className="bg-black rounded-full">
                <View
                    className="px-4 py-3 rounded-full border-2 border-black -translate-y-1.5 -translate-x-1.5 flex-row items-center"
                    style={{ backgroundColor: color }}
                >
                    <Text
                        className="font-inter_black text-white text-xs capitalize"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ flexShrink: 1 }}
                    >
                        {item.title.toLowerCase()}
                    </Text>
                    <Text
                        className="font-inter_black text-white text-xs"
                        style={{ flexShrink: 0 }}
                    >
                        {' '}${Math.floor(Number(item.amount))}
                    </Text>
                </View>
            </View>
        </View>
    );
}