import { View, Text, SectionList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
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
import { groupTransactionsByWeek } from '../../../utils/groupTransactionsByWeeks';
import { useAlert } from '../../components/AlertModal';
import PlusIcon from '@/assets/icons/plus_sign.svg';
import { CATEGORIES } from '../../constants/categories';
import SavingsWhite from '../../../assets/icons/savings_white.svg';
import api from '../../../utils/axios';


export default function CashFlowScreen() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('Jul');
    const [selectedYear, setSelectedYear] = useState(2026);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { refreshTrigger, openModal } = useAppStore();
    const showAlert = useAlert();

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

    const handleDelete = (id: number | string, title: string) => {
        showAlert({
            title: 'Delete transaction?',
            message: `This will permanently remove "${title}".`,
            buttons: [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/transactions/${id}/`);
                            fetchTransactions();
                        } catch (err) {
                            showAlert({ title: 'Error', message: 'Could not delete transaction.' });
                        }
                    },
                },
            ],
        });
    };

    const sections = groupTransactionsByWeek(transactions);

    return (
        <View className="flex-1 relative bg-dark_blue pt-16">
            <TopBar />

            <SectionList
                className="flex-1 px-6"
                sections={sections}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                stickySectionHeadersEnabled={true}
                contentContainerStyle={{ paddingBottom: 140 }}
                ListEmptyComponent={
                    <View className="bg-white rounded-[32px] p-8 items-center mt-2 border-2 border-black/5">
                        <View className="h-16 w-16 bg-gray-100 rounded-full justify-center items-center mb-4">
                            <Feather name="target" size={28} color="black" />
                        </View>
                        <Text className="text-xl font-inter_bold text-black mb-2">No activity yet</Text>
                        <Text className="text-center font-inter_regular text-gray-500 mb-6">
                            Start tracking your expenses and income today.
                        </Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={openModal}
                            className="bg-[#1A1D1A] rounded-full px-6 py-4"
                        >
                            <Text className="text-white font-inter_bold text-sm">Add Your First Transaction</Text>
                        </TouchableOpacity>
                    </View>
                }
                ListHeaderComponent={
                    <>
                        <MonthlyCashFlowChart deposited={totalIncome} expense={totalExpenses} savings={totalSavings} />

                        <ExpensePieChart total={`$${totalExpenses.toFixed(2)}`} categories={categoryBreakdown} />

                        <View className="flex-row justify-between items-center mb-4 mt-2">
                            <Text className="text-xl text-white font-inter_bold">Recent Activity</Text>

                            {transactions.length > 0 && (
                                <View className="flex-row justify-between items-center gap-2">
                                    <TouchableOpacity
                                        onPress={() => setIsFilterOpen(true)}
                                        className="h-12 w-12 bg-black rounded-full justify-center items-center">
                                        <Feather name="filter" size={20} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={openModal}
                                        className="flex-row items-center bg-background_green border-2 border-black rounded-full px-6 py-4"
                                    >
                                        <PlusIcon width={14} height={14} />
                                        <Text className="text-sm font-inter_black text-black ml-1">Add New</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </>
                }
                renderSectionHeader={({ section }) => (
                    <View className="pt-2 pb-3">
                        <Text className="font-inter_bold text-base text-white/50">
                            {section.title}
                        </Text>
                    </View>
                )}
                renderItem={({ item: tx }) => {
                    const parsedAmount = parseFloat(tx.amount);
                    const formattedDate = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

                    if (tx.type === 'INCOME') {
                        return (
                            <View className="flex-row items-center bg-white p-4 rounded-3xl mb-4 border-2 border-black/10">
                                <View className="h-12 w-12 rounded-full bg-black justify-center items-center mr-4">
                                    <Feather name="arrow-down-circle" size={20} color="#22C55E" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-lg font-inter_black">{tx.title}</Text>
                                    <Text className="text-sm font-inter_regular text-gray-500 mt-1">{formattedDate}</Text>
                                </View>
                                <Text className="text-lg font-inter_bold text-green mr-3">
                                    +${parsedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Text>
                                <TouchableOpacity onPress={() => handleDelete(tx.id, tx.title)} className="p-1">
                                    <Feather name="trash-2" size={18} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>
                        );
                    }

                    const isGoal = tx.title.startsWith('Transferred to');
                    const titleCaseCategory = tx.category.charAt(0).toUpperCase() + tx.category.slice(1).toLowerCase();
                    let style = getCategoryStyle(titleCaseCategory) || { label: 'Other', color: 'bg-white', text: 'text-black' };

                    if (isGoal) {
                        style = {
                            label: 'Savings',
                            color: 'bg-yellow',
                            text: 'text-black',
                            icon: SavingsWhite
                        };
                    }

                    return (
                        <View className={`flex-row items-center ${style.color} p-5 rounded-3xl mb-4`}>
                            {(() => {
                                const Icon = (style as any).icon || CATEGORIES.find(c => c.label.toLowerCase() === tx.category.toLowerCase())?.icon;
                                if (!Icon) return null;
                                return (
                                    <View className="mr-4 bg-black rounded-full justify-center items-center h-10 w-10">
                                        <Icon width={18} height={18} color="white" />
                                    </View>
                                );
                            })()}

                            <View className="flex-1">
                                <Text className={`text-lg font-inter_black ${style.text}`}>{tx.title}</Text>
                                <Text className={`text-sm font-inter_regular mt-1 ${style.text === 'text-white' ? 'text-white/70' : 'text-black/60'}`}>
                                    {formattedDate}
                                </Text>
                            </View>
                            <Text className={`text-lg font-inter_black ${style.text} mr-3`}>
                                -${parsedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                            <TouchableOpacity onPress={() => handleDelete(tx.id, tx.title)} className="p-1">
                                <Feather
                                    name="trash-2"
                                    size={18}
                                    color={style.text === 'text-white' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)'}
                                />
                            </TouchableOpacity>
                        </View>
                    );
                }}
            />

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
                transactions={transactions}
                onSelect={() => {
                    const hasData = transactions.some((tx) => {
                        const txDate = new Date(tx.date);
                        const txMonth = txDate.toLocaleDateString('en-US', { month: 'short' });
                        return txMonth === selectedMonth && txDate.getFullYear() === selectedYear;
                    });

                    if (!hasData) {
                        showAlert({
                            title: 'No Data',
                            message: 'No transactions for this month.',
                        });
                        return;
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