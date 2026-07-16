import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAlert } from '../AlertModal';

type Transaction = {
    id: string | number;
    type: 'INCOME' | 'EXPENSE';
    amount: string;
    category: string;
    title: string;
    date: string;
};

interface ReceiptModalProps {
    visible: boolean;
    onClose: () => void;
    month: string;
    year: number;
    transactions: Transaction[];
}

function formatAmount(value: number, sign: '+' | '-') {
    return `${sign}$${Math.abs(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function toTitleCase(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

const isGoalTransfer = (title: string) => title.startsWith('Transferred to');

export default function ReceiptModal({ visible, onClose, month, year, transactions }: ReceiptModalProps) {
    const filtered = transactions.filter((tx) => {
        const txDate = new Date(tx.date);
        const txMonth = txDate.toLocaleDateString('en-US', { month: 'short' });
        return txMonth === month && txDate.getFullYear() === year;
    });

    const incomeTxs = filtered.filter((tx) => tx.type === 'INCOME');
    const expenseTxs = filtered.filter((tx) => tx.type === 'EXPENSE');
    const savingsTxs = expenseTxs.filter((tx) => isGoalTransfer(tx.title));
    const categoryTxs = expenseTxs.filter((tx) => !isGoalTransfer(tx.title));

    const expenseByCategory = categoryTxs.reduce<Record<string, number>>((acc, tx) => {
        const label = toTitleCase(tx.category);
        acc[label] = (acc[label] ?? 0) + parseFloat(tx.amount);
        return acc;
    }, {});

    const totalIncome = incomeTxs.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    const totalExpenses = expenseTxs.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    const net = totalIncome - totalExpenses;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View className="flex-1 bg-black/80 justify-center items-center">
                <View className="bg-[#F9F9F9] w-[85%] p-6 shadow-2xl max-h-[75%]">
                    <Text className="text-center text-xl font-mono font-bold text-black mb-1">MONTHLY RECEIPT</Text>
                    <Text className="text-center font-mono text-gray-500 mb-4">{month} {year}</Text>

                    <View className="border-t-2 border-dashed border-gray-400 my-4" />

                    {filtered.length === 0 ? (
                        <Text className="text-center font-mono text-gray-500 py-6">No transactions this month</Text>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {incomeTxs.length > 0 && (
                                <>
                                    <Text className="font-mono text-black text-base font-bold mb-2">INCOME</Text>
                                    {incomeTxs.map((tx) => (
                                        <View key={tx.id} className="flex-row justify-between mb-1.5">
                                            <Text className="font-mono text-black text-sm flex-1 mr-2" numberOfLines={1}>
                                                {tx.title}
                                            </Text>
                                            <Text className="font-mono text-black text-sm">
                                                {formatAmount(parseFloat(tx.amount), '+')}
                                            </Text>
                                        </View>
                                    ))}
                                    <View className="flex-row justify-between mt-2 mb-4">
                                        <Text className="font-mono text-black text-sm font-bold">Total Income</Text>
                                        <Text className="font-mono text-black text-sm font-bold">
                                            {formatAmount(totalIncome, '+')}
                                        </Text>
                                    </View>
                                </>
                            )}

                            {Object.keys(expenseByCategory).length > 0 && (
                                <>
                                    <Text className="font-mono text-black text-base font-bold mb-2">EXPENSES</Text>
                                    {Object.entries(expenseByCategory).map(([category, amount]) => (
                                        <View key={category} className="flex-row justify-between mb-1.5">
                                            <Text className="font-mono text-black text-sm">{category}</Text>
                                            <Text className="font-mono text-black text-sm">
                                                {formatAmount(amount, '-')}
                                            </Text>
                                        </View>
                                    ))}
                                </>
                            )}

                            {savingsTxs.length > 0 && (
                                <>
                                    <Text className="font-mono text-black text-base font-bold mb-2 mt-2">SAVINGS</Text>
                                    {savingsTxs.map((tx) => (
                                        <View key={tx.id} className="flex-row justify-between mb-1.5">
                                            <Text className="font-mono text-black text-sm flex-1 mr-2" numberOfLines={1}>
                                                {tx.title.replace('Transferred to ', '')}
                                            </Text>
                                            <Text className="font-mono text-black text-sm">
                                                {formatAmount(parseFloat(tx.amount), '-')}
                                            </Text>
                                        </View>
                                    ))}
                                </>
                            )}

                            {expenseTxs.length > 0 && (
                                <View className="flex-row justify-between mt-2 mb-2">
                                    <Text className="font-mono text-black text-sm font-bold">Total Expenses</Text>
                                    <Text className="font-mono text-black text-sm font-bold">
                                        {formatAmount(totalExpenses, '-')}
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    )}

                    <View className="border-t-2 border-dashed border-gray-400 my-4" />

                    <View className="flex-row justify-between">
                        <Text className="font-mono font-bold text-black text-lg">NET TOTAL</Text>
                        <Text className="font-mono font-bold text-black text-lg">
                            {formatAmount(net, net >= 0 ? '+' : '-')}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity onPress={onClose} className="mt-8 bg-white px-6 py-2 rounded-full">
                    <Text className="font-bold text-black">Close Receipt</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}