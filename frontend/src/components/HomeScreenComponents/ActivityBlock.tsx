import { View, Text } from 'react-native';
import { Transaction } from '../../hooks/useCashFlow';

interface ActivityBlockProps {
    item: Transaction;
    color?: string; // Optional: Pass different colors for the pills like the image
}

export function ActivityBlock({ item, color = '#4361EE' }: ActivityBlockProps) {
    return (
        // maxWidth ensures no more than 3 fit in a row (33.3% minus margins)
        <View className="m-2" style={{ maxWidth: '30%' }}>
            {/* Dark Black Shadow Background */}
            <View className="bg-black rounded-full">
                {/* Foreground Pill (Shifted up and left) */}
                <View
                    className="px-4 py-3 rounded-full border-2 border-black -translate-y-1.5 -translate-x-1.5 flex-row items-center justify-center"
                    style={{ backgroundColor: color }}
                >
                    <Text
                        className="font-inter_black text-white text-xs capitalize"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {item.title.toLowerCase()} ${Math.floor(Number(item.amount))}
                    </Text>
                </View>
            </View>
        </View>
    );
}