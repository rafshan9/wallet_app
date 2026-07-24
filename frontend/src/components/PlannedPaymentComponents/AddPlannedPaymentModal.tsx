// components/AddPlannedPaymentModal.tsx
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import api from '../../../utils/axios';
import { CATEGORY_STYLES, FREQUENCIES, PaymentCategory } from '../../constants/paymentCategories';
import { useAlert } from '../AlertModal';
import DateTimePicker from '@expo/ui/community/datetime-picker';

type Props = {
    visible: boolean;
    onClose: () => void;
};

export default function AddPlannedPaymentModal({ visible, onClose }: Props) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState(''); // YYYY-MM-DD — swap for a date picker if you have one
    const [category, setCategory] = useState<PaymentCategory>('other');
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState<typeof FREQUENCIES[number]>('monthly');
    const [isSaving, setIsSaving] = useState(false);
    const [showDueDatePicker, setShowDueDatePicker] = useState(false);

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const dueDateValue = dueDate ? new Date(dueDate) : new Date();

    // Fixed destructuring here based on your previous setup
    const showAlert = useAlert();

    const reset = () => {
        setName(''); setAmount(''); setDueDate(''); setCategory('other'); setIsRecurring(false); setFrequency('monthly');
    };

    const handleSave = async () => {
        if (!name.trim() || !amount || !dueDate) {
            showAlert({ title: 'Missing info', message: 'Name, amount, and due date are required.' });
            return;
        }
        setIsSaving(true);
        try {
            await api.post('/planned-payments/', {
                name: name.trim(),
                amount: parseFloat(amount),
                dueDate: dueDate,
                category,
                isRecurring: isRecurring,
                frequency: isRecurring ? frequency : null,
            });
            reset();
            onClose();
        } catch (error) {
            console.error('Failed to create planned payment', error);
            showAlert({ title: 'Something went wrong', message: 'Could not save this payment. Try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            {/* 1. Root level KeyboardAvoidingView */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            >
                {/* 2. Backdrop container */}
                <View className="flex-1 justify-end bg-black/40">

                    {/* 3. White bottom sheet */}
                    <View className="bg-white rounded-t-[32px] border-2 border-black px-6 pt-6" style={{ maxHeight: '85%' }}>

                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="font-inter_bold text-xl">Add Payment</Text>
                            <TouchableOpacity onPress={onClose} hitSlop={8}>
                                <Feather name="x" size={22} color="black" />
                            </TouchableOpacity>
                        </View>

                        {/* 4. ScrollView */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            <Text className="font-inter_medium text-xs text-gray-400 mb-2 uppercase">Name</Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="e.g. Rent"
                                className="border-2 border-black/10 rounded-2xl px-4 py-3 font-inter_medium mb-4"
                            />

                            <Text className="font-inter_medium text-xs text-gray-400 mb-2 uppercase">Amount</Text>
                            <TextInput
                                value={amount}
                                onChangeText={setAmount}
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                                className="border-2 border-black/10 rounded-2xl px-4 py-3 font-inter_medium mb-4"
                            />

                            <Text className="font-inter_medium text-xs text-gray-400 mb-2 uppercase">Due date</Text>
                            <TouchableOpacity
                                onPress={() => setShowDueDatePicker(true)}
                                className="border-2 border-black/10 rounded-2xl px-4 py-3 mb-4 flex-row items-center justify-between"
                            >
                                <Text className={`font-inter_medium ${dueDate ? 'text-black' : 'text-gray-400'}`}>
                                    {dueDate || 'YYYY-MM-DD'}
                                </Text>
                                <Feather name="calendar" size={20} color="gray" />
                            </TouchableOpacity>

                            {showDueDatePicker && (
                                <DateTimePicker
                                    value={dueDateValue}
                                    mode="date"
                                    presentation="dialog"
                                    minimumDate={new Date()}
                                    onValueChange={(event, selectedDate) => {
                                        setShowDueDatePicker(false);
                                        setDueDate(formatDate(selectedDate));
                                    }}
                                    onDismiss={() => setShowDueDatePicker(false)}
                                />
                            )}

                            <Text className="font-inter_medium text-xs text-gray-400 mb-2 uppercase">Category</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                                {(Object.keys(CATEGORY_STYLES) as PaymentCategory[]).map((key) => {
                                    const style = CATEGORY_STYLES[key];
                                    const selected = category === key;
                                    return (
                                        <TouchableOpacity
                                            key={key}
                                            onPress={() => setCategory(key)}
                                            className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${selected ? style.bg : 'bg-black/5'}`}
                                        >
                                            <Feather name={style.icon} size={14} color={selected ? 'white' : 'black'} />
                                            <Text className={`ml-2 font-inter_medium text-xs ${selected ? 'text-white' : 'text-black'}`}>
                                                {style.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>

                            <TouchableOpacity
                                onPress={() => setIsRecurring((prev) => !prev)}
                                className="flex-row items-center justify-between border-2 border-black/10 rounded-2xl px-4 py-3 mb-4"
                            >
                                <Text className="font-inter_medium">Repeats</Text>
                                <View className={`w-12 h-7 rounded-full justify-center px-1 ${isRecurring ? 'bg-black' : 'bg-black/10'}`}>
                                    <View className={`w-5 h-5 rounded-full bg-white ${isRecurring ? 'self-end' : 'self-start'}`} />
                                </View>
                            </TouchableOpacity>

                            {isRecurring && (
                                <View className="flex-row mb-4">
                                    {FREQUENCIES.map((freq) => (
                                        <TouchableOpacity
                                            key={freq}
                                            onPress={() => setFrequency(freq)}
                                            className={`px-4 py-2 rounded-full mr-2 ${frequency === freq ? 'bg-black' : 'bg-black/5'}`}
                                        >
                                            <Text className={`font-inter_medium text-xs capitalize ${frequency === freq ? 'text-white' : 'text-black'}`}>
                                                {freq}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            <TouchableOpacity
                                onPress={handleSave}
                                disabled={isSaving}
                                className="bg-black py-4 rounded-full items-center mt-2"
                            >
                                <Text className="text-white font-inter_bold">{isSaving ? 'Saving...' : 'Save Payment'}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}