import { View, Text } from 'react-native';

type WalletCardProps = {
    title: string;
    amount: string;
    subtitle: string;
    bgClass: string;
};

export default function WalletCard({ title, amount, subtitle, bgClass }: WalletCardProps) {
    return (
        <View
            className={`w-80 h-72 rounded-[40px] p-6 justify-between mr-4 border-4 border-dashed border-gray-800 ${bgClass}`}        >
            {/* Top Row */}
            <View className="flex-row justify-between items-start">
                <View className="bg-black px-4 py-2 rounded-full">
                    <Text className="text-white font-rubik_bold">{title}</Text>
                </View>
                <View className="h-14 w-14 bg-white rounded-full" />
            </View>

            {/* Bottom Row */}
            <View>
                <Text className="text-white text-5xl font-rubik_bold mb-2">{amount}</Text>
                <Text className="text-white font-rubik_medium text-lg">{subtitle}</Text>
            </View>
        </View>
    );
}