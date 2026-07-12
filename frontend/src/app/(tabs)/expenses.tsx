import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import ExpensePieChart from '../../components/ExpenseComponents/ExpensePieChart';
import AddExpenseModal from '../../components/ExpenseComponents/AddExpenseModal';
import { getCategoryStyle } from '../../constants/categories';

const DUMMY_EXPENSES = [
    { id: '1', title: 'Weekly Groceries', amount: '$120.50', category: 'Groceries', date: 'July 12, 10:30 AM' },
    { id: '2', title: 'Netflix Subscription', amount: '$15.99', category: 'Subscriptions' },
    { id: '3', title: 'Turf Booking', amount: '$30.00', category: 'Entertainment', date: 'July 11, 8:00 PM' },
    { id: '4', title: 'New Boots', amount: '$85.00', category: 'Shopping', date: 'July 10, 2:15 PM' },
];

// Percentages calculated from the amounts above (sum = $251.49)
const CATEGORY_BREAKDOWN = [
    { label: 'Food', percent: 48, color: 'bg-blue', hex: '#3B82F6' },
    { label: 'Gear', percent: 34, color: 'bg-green', hex: '#22C55E' },
    { label: 'Football', percent: 12, color: 'bg-yellow', hex: '#EAB308' },
    { label: 'Subs', percent: 6, color: 'bg-red', hex: '#EF4444' },
];

export default function ExpensesScreen() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <View className="flex-1 relative bg-background pt-16">

            {/* Header */}
            <View className="px-6 flex-row justify-between items-center mb-6">
                <Text className="text-3xl font-rubik_bold">Expenses</Text>
                <TouchableOpacity className="h-12 w-12 bg-black rounded-full justify-center items-center">
                    <Feather name="filter" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >
                <ExpensePieChart total="$251.49" categories={CATEGORY_BREAKDOWN} />
                <View className="flex-row justify-between items-center mb-4">
                    {/* Transactions List */}
                    <Text className="text-xl font-rubik_bold">Recent Transactions</Text>

                    {/* Add New Button */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setIsModalOpen(true)}
                        className="flex-row items-center bg-maroon border-2 border-black/40 rounded-full px-6 py-4"
                    >
                        <Feather name="plus" size={16} color="white" />
                        <Text className="text-sm font-rubik_bold text-white ml-1">Add New</Text>
                    </TouchableOpacity>
                </View>



                {DUMMY_EXPENSES.map((expense) => {
                    const style = getCategoryStyle(expense.category);
                    return (
                        <View
                            key={expense.id}
                            className={`flex-row items-center ${style.color} p-4 rounded-3xl mb-4 border-2 border-black border-dashed`}
                        >
                            <View className="h-12 w-12 rounded-full bg-white/20 justify-center items-center mr-4">
                                <Feather name="shopping-bag" size={20} color={style.text === 'text-white' ? 'white' : 'black'} />
                            </View>

                            <View className="flex-1">
                                <Text className={`text-lg font-rubik_medium ${style.text}`}>{expense.title}</Text>
                                {expense.date && (
                                    <Text className={`text-sm font-rubik_regular mt-1 ${style.text === 'text-white' ? 'text-white/70' : 'text-black/60'}`}>
                                        {expense.date}
                                    </Text>
                                )}
                            </View>

                            <Text className={`text-lg font-rubik_bold ${style.text}`}>{expense.amount}</Text>
                        </View>
                    );
                })}
            </ScrollView>

            <AddExpenseModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} />




        </View>
    );
}