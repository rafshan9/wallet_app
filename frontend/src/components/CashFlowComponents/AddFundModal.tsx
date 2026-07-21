import { View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { CATEGORIES } from '../../constants/categories';
import api from '../../../utils/axios'
import { useAppStore } from '../../store'
import { useAlert } from '../AlertModal';
import ScannerButton from '../ui/ScannerButton';
import AiReviewModal from './AiReviewModal';


type AddExpenseModalProps = {
    visible: boolean;
    onClose: () => void;
};


export default function AddExpenseModal({ visible, onClose }: AddExpenseModalProps) {
    const [type, setType] = useState<'expense' | 'income'>('expense');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { triggerRefresh } = useAppStore();
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const showAlert = useAlert();
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState<any[]>([]);
    const [reviewVisible, setReviewVisible] = useState(false);


    const handleScanComplete = (data: any) => {
        setIsScanning(false);
        if (data) {
            setScannedData(data.items);
            setReviewVisible(true);
            setType('expense');
        }
        setIsScanning(false);
    };

    const handleSaveScannedItems = async (items: { name: string; amount: number; category: string }[]) => {
        for (const item of items) {
            try {
                await api.post('/transactions/', {
                    type: 'EXPENSE',
                    title: item.name,
                    amount: item.amount.toString(),
                    category: item.category.toUpperCase(), // Matching your CATEGORY_HEX format
                });
            } catch (error) {
                console.error("Error saving:", item.name, error);
            }
        }

        setReviewVisible(false); // Close AI review modal
        onClose(); // Close AddFundModal to trigger the refresh
    };

    const handleSubmit = async () => {
        if (!amount || !title) {
            showAlert({ title: 'Error', message: 'Please enter an amount and title' });
            return;
        }
        if (type === 'expense' && !selectedCategory) {
            showAlert({ title: 'Error', message: 'Please select a category.' });
            return;
        }
        setIsLoading(true)

        try {
            await api.post('/transactions/', {
                type: type.toUpperCase(),
                amount: amount.replace(/[^0-9.]/g, ''),
                title: title,
                category: type === 'expense' ? selectedCategory?.toUpperCase() : 'OTHER',
            });
            setAmount('');
            setTitle('');
            setSelectedCategory(null);
            setType('expense');

            triggerRefresh();
            onClose();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save transaction.');
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <KeyboardAvoidingView
                behavior="padding"
                className="flex-1"
            >
                <View className="flex-1 justify-end bg-black/80">
                    <View className="bg-very_dark_blue w-full rounded-t-[40px] p-8 border-2 border-black max-h-[90%]">
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >

                            {/* AI Processing Overlay */}
                            {isScanning && (
                                <View className="absolute inset-0 bg-very_dark_blue/80 z-50 justify-center items-center rounded-t-[40px]">
                                    <ActivityIndicator size="large" color="#fff" />
                                    <Text className="mt-4 font-inter_bold text-white text-lg">Analyzing receipt...</Text>
                                </View>
                            )}

                            <View className="flex-row justify-between items-center mb-8">
                                <Text className="text-3xl font-inter_bold text-white">
                                    {type === 'expense' ? 'New Expense' : 'New Income'}
                                </Text>
                                <TouchableOpacity
                                    className="rounded-full border-2 border-black p-2 bg-yellow"
                                    onPress={onClose}>
                                    <Feather name="x" size={28} color="black" />
                                </TouchableOpacity>
                            </View>

                            {/* Type Toggle */}
                            <View className="flex-row bg-black/30 rounded-full p-1 mb-6">
                                <TouchableOpacity
                                    onPress={() => setType('expense')}
                                    className={`flex-1 items-center py-3 rounded-full ${type === 'expense' ? 'bg-white' : ''}`}
                                >
                                    <Text className={`font-inter_black text-sm ${type === 'expense' ? 'text-black' : 'text-white/50'}`}>
                                        Expense
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setType('income');
                                        setSelectedCategory(null);
                                    }}
                                    className={`flex-1 items-center py-3 rounded-full ${type === 'income' ? 'bg-white' : ''}`}
                                >
                                    <Text className={`font-inter_black text-sm ${type === 'income' ? 'text-black' : 'text-white/50'}`}>
                                        Income
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                placeholder="$0.00"
                                keyboardType="numeric"
                                placeholderTextColor="rgba(255,255,255,0.5)"
                                scrollEnabled={false}
                                multiline={false}
                                value={amount}
                                onChangeText={setAmount}
                                className="text-6xl font-inter_bold text-white text-center mb-8"
                                style={{
                                    textAlignVertical: 'center',
                                    includeFontPadding: false,
                                    paddingVertical: 0,
                                    height: 80,
                                }}
                            />

                            <TextInput
                                placeholder={type === 'expense' ? 'What was this for?' : 'Where did this come from?'}
                                value={title}
                                onChangeText={setTitle}
                                className="bg-white px-6 py-4 rounded-2xl border-2 border-black font-inter_medium text-lg mb-6"
                            />

                            {/* Category Pills — expense only */}
                            {type === 'expense' && (
                                <View className="flex-row flex-wrap mb-6">
                                    {CATEGORIES.map((cat) => {
                                        const isSelected = selectedCategory === cat.label;
                                        return (
                                            <TouchableOpacity
                                                key={cat.label}
                                                onPress={() => setSelectedCategory(isSelected ? null : cat.label)}
                                                className={`${cat.color} flex-row items-center px-4 py-2 rounded-full mr-2 mb-2 border-2`}
                                                style={{
                                                    borderColor: isSelected ? 'white' : 'black',
                                                    opacity: !selectedCategory || isSelected ? 1 : 0.4,
                                                }}
                                            >
                                                {isSelected && (
                                                    <Feather
                                                        name="check"
                                                        size={14}
                                                        color={cat.text === 'text-white' ? 'white' : 'black'}
                                                        style={{ marginRight: 4 }}
                                                    />
                                                )}
                                                <Text className={`font-inter_medium text-sm ${cat.text}`}>{cat.label}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}

                            <View className="flex-row justify-between items-center mb-8">
                                <View className="flex-row gap-4">
                                    <View className="flex-row gap-4">
                                        <ScannerButton
                                            isScanning={isScanning}
                                            onScanStart={() => setIsScanning(true)}
                                            onScanComplete={handleScanComplete}
                                        />

                                    </View>
                                </View>

                                <TouchableOpacity
                                    className="bg-maroon px-8 py-4 rounded-full flex-row items-center shadow-md border-2 border-black"
                                    onPress={handleSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <>
                                            <Text className="text-white font-inter_bold text-lg mr-2">
                                                {type === 'expense' ? 'Add Expense' : 'Add Income'}
                                            </Text>
                                            <Feather name="check" size={20} color="white" />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
            <AiReviewModal
                visible={reviewVisible}
                onClose={() => setReviewVisible(false)}
                onConfirm={handleSaveScannedItems}
                scannedData={scannedData}
            />
        </Modal>
    );
}