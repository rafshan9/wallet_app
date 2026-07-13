import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import ExpensePieChart from '../../components/CashFlowComponents/ExpensePieChart';
import AddExpenseModal from '../../components/CashFlowComponents/AddFundModal';
import MonthlyCashFlowChart from '../../components/CashFlowComponents/MonthlyCashFlowChart';
import { getCategoryStyle } from '../../constants/categories';
import { useCashFlow } from '../../hooks/useCashFlow';
import { useAppStore } from '../../store';
import MonthYearPickerModal from '../../components/CashFlowComponents/MonthYearPickerModal';
import ReceiptModal from '../../components/CashFlowComponents/ReceiptModal';
import TopBar from '../../components/TopBar';


export default function CashFlowScreen() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('Jul');
    const [selectedYear, setSelectedYear] = useState(2026);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { refreshTrigger, openModal } = useAppStore();

    const {
        transactions,
        isLoading,
        fetchTransactions,
        totalIncome,
        totalExpenses,
        categoryBreakdown,
        totalSavings
    } = useCashFlow();

    useEffect(() => {
        fetchTransactions();
    }, [refreshTrigger]);

    if (isLoading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View className="flex-1 relative bg-background pt-16">
            <TopBar />

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >
                <MonthlyCashFlowChart deposited={totalIncome} expense={totalExpenses} savings={totalSavings} />

                <ExpensePieChart total={`$${totalExpenses.toFixed(2)}`} categories={categoryBreakdown} />

                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-rubik_bold">Recent Activity</Text>
                    <View className="flex-row justify-between items-center gap-2">
                        <TouchableOpacity
                            onPress={() => setIsFilterOpen(true)}
                            className="h-12 w-12 bg-black rounded-full justify-center items-center">
                            <Feather name="filter" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={openModal}
                            className="flex-row items-center bg-maroon border-2 border-black/40 rounded-full px-6 py-4"
                        >
                            <Feather name="plus" size={16} color="white" />
                            <Text className="text-sm font-rubik_bold text-white ml-1">Add New</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                {transactions.map((tx) => {
                    const parsedAmount = parseFloat(tx.amount);
                    const formattedDate = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

                    if (tx.type === 'INCOME') {
                        return (
                            <View key={tx.id} className="flex-row items-center bg-white p-4 rounded-3xl mb-4 border-2 border-black/10">
                                <View className="h-12 w-12 rounded-full bg-green/10 justify-center items-center mr-4">
                                    <Feather name="arrow-down-circle" size={20} color="#22C55E" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-lg font-rubik_medium">{tx.title}</Text>
                                    <Text className="text-sm font-rubik_regular text-gray-500 mt-1">{formattedDate}</Text>
                                </View>
                                <Text className="text-lg font-rubik_bold text-green">
                                    +${parsedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Text>
                            </View>
                        );
                    }

                    const isGoal = tx.title.startsWith('Transferred to');

                    const titleCaseCategory = tx.category.charAt(0).toUpperCase() + tx.category.slice(1).toLowerCase();

                    let style = getCategoryStyle(titleCaseCategory) || { label: 'Other', color: 'bg-white', text: 'text-black' };

                    if (isGoal) {
                        style = { label: 'Savings', color: 'bg-yellow', text: 'black' };
                    }

                    return (
                        <View key={tx.id} className={`flex-row items-center ${style.color} p-4 rounded-3xl mb-4 border-2 border-black border-dashed`}>
                            <View className="h-12 w-12 rounded-full bg-white/20 justify-center items-center mr-4">
                                <Feather name="shopping-bag" size={20} color={style.text === 'text-white' ? 'white' : 'black'} />
                            </View>
                            <View className="flex-1">
                                <Text className={`text-lg font-rubik_medium ${style.text}`}>{tx.title}</Text>
                                <Text className={`text-sm font-rubik_regular mt-1 ${style.text === 'text-white' ? 'text-white/70' : 'text-black/60'}`}>
                                    {formattedDate}
                                </Text>
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
                    fetchTransactions();
                }}
            />
            <MonthYearPickerModal
                visible={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                month={selectedMonth}
                setMonth={setSelectedMonth}
                year={selectedYear}
                setYear={setSelectedYear}
                transactions={transactions} onSelect={() => {
                    const hasData = transactions.some((tx) => {
                        const txDate = new Date(tx.date);
                        const txMonth = txDate.toLocaleDateString('en-US', { month: 'short' });
                        return txMonth === selectedMonth && txDate.getFullYear() === selectedYear;
                    });

                    if (!hasData) {
                        Alert.alert("No Data", "No transactions for this month.");
                        return; // picker stays open — no Modal close animation to race against
                    }

                    setIsFilterOpen(false);
                    setTimeout(() => setIsReceiptOpen(true), 300);
                }}
            />

            <ReceiptModal
                visible={isReceiptOpen}
                onClose={() => setIsReceiptOpen(false)}
                month={selectedMonth}
                year={selectedYear}
                transactions={transactions}
            />
        </View>
    );
}