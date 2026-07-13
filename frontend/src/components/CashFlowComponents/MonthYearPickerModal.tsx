import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type Transaction = {
    id: string | number;
    date: string;
};

interface MonthYearPickerProps {
    visible: boolean;
    onClose: () => void;
    onSelect: () => void;
    month: string;
    setMonth: (month: string) => void;
    year: number;
    setYear: (year: number) => void;
    transactions: Transaction[];
}

export default function MonthYearPickerModal({
    visible,
    onClose,
    onSelect,
    month,
    setMonth,
    year,
    setYear,
    transactions,
}: MonthYearPickerProps) {
    const monthsWithData = new Set(
        transactions
            .filter((tx) => new Date(tx.date).getFullYear() === year)
            .map((tx) => new Date(tx.date).toLocaleDateString('en-US', { month: 'short' }))
    );

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View className="flex-1 justify-end bg-black/60">
                <View className="bg-very_dark_blue rounded-t-3xl p-6 pb-10">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-xl font-rubik_medium text-white">Select Month</Text>
                        <TouchableOpacity
                            className='bg-yellow rounded-full p-2 border-2 border-black'
                            onPress={onClose}><Feather name="x" size={24} color="black" /></TouchableOpacity>
                    </View>

                    {/* Year Selector */}
                    <View className="flex-row justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm">
                        <TouchableOpacity onPress={() => setYear(year - 1)}>
                            <Feather name="chevron-left" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="text-lg font-rubik_bold text-black">{year}</Text>
                        <TouchableOpacity onPress={() => setYear(year + 1)}>
                            <Feather name="chevron-right" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Months Grid */}
                    <View className="flex-row flex-wrap justify-between">
                        {MONTHS.map((m) => {
                            const isSelected = month === m;
                            const hasData = monthsWithData.has(m);
                            const bg = isSelected ? 'bg-yellow' : hasData ? 'bg-teal' : 'bg-white';
                            const textColor = isSelected || hasData ? 'text-black' : 'text-gray-400';

                            return (
                                <TouchableOpacity
                                    key={m}
                                    onPress={() => setMonth(m)}
                                    className={`w-[30%] py-3 mb-4 rounded-xl items-center shadow-sm ${bg}`}
                                >
                                    <Text className={`font-rubik_medium ${textColor}`}>{m}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Generate Receipt Button */}
                    <TouchableOpacity
                        onPress={onSelect}
                        className="bg-black py-4 rounded-full mt-2 items-center"
                    >
                        <Text className="text-white font-rubik_medium text-lg">View Receipt</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}