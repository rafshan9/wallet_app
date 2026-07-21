import { View, Text } from 'react-native';

type Props = {
    title: string;
    amount: string;
    subtitle: string;
    isLight: boolean;
    amountColorClass: string;
};

export default function WalletCard({ title, amount, subtitle, isLight, amountColorClass }: Props) {
    const textColor = isLight ? 'text-black' : 'text-white';

    return (
        <View className="flex-1 items-center justify-center px-4 pt-10">
            {/* Title - REMAINING FUNDS */}
            <Text
                className={`font-alfa uppercase text-center text-5xl leading-tight mb-2 ${textColor}`}
            >
                {title.replace(' ', '\n')} {/* Forces line break like design */}
            </Text>

            {/* Amount - $3,417 */}
            <Text
                className={`font-alfa text-center text-7xl my-2 ${amountColorClass}`}
            >
                {amount}
            </Text>

            {/* Subtitle - Total Deposited... */}
            <Text
                className={`font-inter_black text-center text-sm mt-4 mb-4 ${textColor}`}
            >
                {subtitle}
            </Text>
        </View>
    );
}