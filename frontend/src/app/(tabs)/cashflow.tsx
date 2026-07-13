import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import ExpensePieChart from '../../components/CashFlowComponents/ExpensePieChart';
import AddExpenseModal from '../../components/CashFlowComponents/AddFundModal';
import MonthlyCashFlowChart from '../../components/CashFlowComponents/MonthlyCashFlowChart';
import { getCategoryStyle } from '../../constants/categories';
import api from '../../../utils/axios';

type Transaction =
    {
        id: string; type: 'INCOME' | 'EXPENSE'; title: string; amount: string; category: string; date: string
    }

// Add above the component:
const CATEGORY_HEX: Record<string, string> = {
    Groceries: '#0eff66ff',
    Subscriptions: '#fbfbfbff',
    Entertainment: '#ffde0fff',
    Shopping: '#3b08f7ff',
};

function getCategoryBreakdown(transactions: Transaction[]) {
    const expenseTxs = transactions.filter(t => t.type === 'EXPENSE');
    const total = expenseTxs.reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const grouped = expenseTxs.reduce<Record<string, number>>((acc, t) => {
        const amt = parseFloat(t.amount);
        acc[t.category] = (acc[t.category] ?? 0) + amt;
        return acc;
    }, {});

    return Object.entries(grouped)
        .map(([label, amount]) => ({
            label,
            amount,
            percent: Math.round((amount / total) * 100) || 0,
            hex: CATEGORY_HEX[label] ?? '#888888',
        }))
        .sort((a, b) => b.amount - a.amount);
}

export default function CashFlowScreen() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/transactions/');
            setTransactions(response.data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);
    // calculations to use parseFloat and uppercase types
    const totalIncome = transactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = transactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const categoryBreakdown = getCategoryBreakdown(transactions);

    if (isLoading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View className="flex-1 relative bg-background pt-16">

            {/* Header */}
            <View className="px-6 flex-row justify-between items-center mb-6">
                <Text className="text-3xl font-rubik_bold">Cash Flow</Text>
                <TouchableOpacity className="h-12 w-12 bg-black rounded-full justify-center items-center">
                    <Feather name="filter" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >
                <MonthlyCashFlowChart deposited={totalIncome} expense={totalExpenses} savings={45} />

                <ExpensePieChart total={`$${totalExpenses.toFixed(2)}`} categories={categoryBreakdown} />


                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-rubik_bold">Recent Activity</Text>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setIsModalOpen(true)}
                        className="flex-row items-center bg-maroon border-2 border-black/40 rounded-full px-6 py-4"
                    >
                        <Feather name="plus" size={16} color="white" />
                        <Text className="text-sm font-rubik_bold text-white ml-1">Add New</Text>
                    </TouchableOpacity>
                </View>

                {transactions.map((tx) => {
                    const parsedAmount = parseFloat(tx.amount);
                    const formattedDate = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    if (tx.type === 'INCOME') {
                        return (
                            <View
                                key={tx.id}
                                className="flex-row items-center bg-white p-4 rounded-3xl mb-4 border-2 border-black/10"
                            >
                                <View className="h-12 w-12 rounded-full bg-green/10 justify-center items-center mr-4">
                                    <Feather name="arrow-down-circle" size={20} color="#22C55E" />
                                </View>

                                <View className="flex-1">
                                    <Text className="text-lg font-rubik_medium">{tx.title}</Text>
                                    {tx.date && (
                                        <Text className="text-sm font-rubik_regular text-gray-500 mt-1">{tx.date}</Text>
                                    )}
                                </View>

                                <Text className="text-lg font-rubik_bold text-green">
                                    +${parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Text>
                            </View>
                        );
                    }

                    const style = getCategoryStyle(tx.category);
                    return (
                        <View
                            key={tx.id}
                            className={`flex-row items-center ${style.color} p-4 rounded-3xl mb-4 border-2 border-black border-dashed`}
                        >
                            <View className="h-12 w-12 rounded-full bg-white/20 justify-center items-center mr-4">
                                <Feather name="shopping-bag" size={20} color={style.text === 'text-white' ? 'white' : 'black'} />
                            </View>

                            <View className="flex-1">
                                <Text className={`text-lg font-rubik_medium ${style.text}`}>{tx.title}</Text>
                                {tx.date && (
                                    <Text className={`text-sm font-rubik_regular mt-1 ${style.text === 'text-white' ? 'text-white/70' : 'text-black/60'}`}>
                                        {tx.date}
                                    </Text>
                                )}
                            </View>

                            <Text className={`text-lg font-rubik_bold ${style.text}`}>
                                -${parsedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>

            <AddExpenseModal
                visible={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    fetchTransactions(); // Refresh data after closing modal
                }}
            />
        </View>
    );
}