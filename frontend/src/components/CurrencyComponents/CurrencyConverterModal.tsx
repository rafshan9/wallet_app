import { useState } from 'react';
import {
    View, Text, Modal, TouchableOpacity, TextInput,
    ActivityIndicator, KeyboardAvoidingView, ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCurrencyConverter } from '../../hooks/useCurrencyConverter';
import { useAppStore } from '../../store';
import { CATEGORIES } from '../../constants/categories';
import { CURRENCIES } from '../../constants/currencies';
import api from '../../../utils/axios';
import { useAlert } from '../AlertModal';
import CurrencyPickerModal from './CurrencyPickerModal';

type Step = 'convert' | 'log';
type LogType = 'income' | 'expense';

type Props = {
    visible: boolean;
    onClose: () => void;
};

export default function CurrencyConverterModal({ visible, onClose }: Props) {
    const { preferredCurrency, triggerRefresh } = useAppStore();
    const { convert, isLoading, error } = useCurrencyConverter();
    const showAlert = useAlert();

    const [step, setStep] = useState<Step>('convert');
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState(preferredCurrency);
    const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
    const [logType, setLogType] = useState<LogType>('income');
    const [expenseTitle, setExpenseTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);

    const getCurrencySymbol = (code: string) =>
        CURRENCIES.find((c) => c.code === code)?.symbol ?? code;

    const handleConvert = async () => {
        const num = parseFloat(amount.replace(/[^0-9.]/g, ''));
        if (!num || isNaN(num)) {
            showAlert({ title: 'Invalid amount', message: 'Please enter a valid number.' });
            return;
        }
        try {
            const result = await convert(num, fromCurrency, toCurrency);
            setConvertedAmount(result);
        } catch {
            // error shown from hook
        }
    };

    const handleLogIncome = async () => {
        if (!convertedAmount) return;
        setIsSaving(true);
        try {
            await api.post('/transactions/', {
                type: 'INCOME',
                amount: convertedAmount.toString(),
                title: `${amount} ${fromCurrency} converted to ${toCurrency}`,
                category: 'OTHER',
            });
            triggerRefresh();
            handleClose();
        } catch {
            showAlert({ title: 'Error', message: 'Failed to save income.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogExpense = async () => {
        if (!convertedAmount) return;
        if (!expenseTitle.trim()) {
            showAlert({ title: 'Missing title', message: 'Please enter a title for this expense.' });
            return;
        }
        if (!selectedCategory) {
            showAlert({ title: 'Missing category', message: 'Please select a category.' });
            return;
        }
        setIsSaving(true);
        try {
            await api.post('/transactions/', {
                type: 'EXPENSE',
                amount: convertedAmount.toString(),
                title: expenseTitle.trim(),
                category: selectedCategory.toUpperCase(),
            });
            triggerRefresh();
            handleClose();
        } catch {
            showAlert({ title: 'Error', message: 'Failed to save expense.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setStep('convert');
        setAmount('');
        setConvertedAmount(null);
        setFromCurrency('USD');
        setToCurrency(preferredCurrency);
        setLogType('income');
        setExpenseTitle('');
        setSelectedCategory(null);
        onClose();
    };

    return (
        <>
            <Modal visible={visible} animationType="slide" transparent>
                <KeyboardAvoidingView behavior="padding" className="flex-1">
                    <View className="flex-1 justify-end bg-black/80">
                        <View className="bg-background w-full rounded-t-[40px] p-8 border-2 border-black max-h-[92%]">
                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                                {/* Header */}
                                <View className="flex-row justify-between items-center mb-8">
                                    <Text className="text-3xl font-jb_mono_bold text-black">
                                        {step === 'convert' ? 'Convert' : logType === 'income' ? 'Log Income' : 'Log Expense'}
                                    </Text>
                                    <TouchableOpacity className="rounded-full border-2 border-black p-2 bg-yellow" onPress={handleClose}>
                                        <Feather name="x" size={28} color="black" />
                                    </TouchableOpacity>
                                </View>

                                {step === 'convert' ? (
                                    <>
                                        {/* Amount input */}
                                        <TextInput
                                            placeholder="0.00"
                                            keyboardType="numeric"
                                            placeholderTextColor="rgba(100,100,100,0.4)"
                                            value={amount}
                                            onChangeText={setAmount}
                                            className="text-6xl font-jb_mono_bold text-black text-center mb-8"
                                            style={{ textAlignVertical: 'center', includeFontPadding: false, paddingVertical: 0, height: 80 }}
                                        />

                                        {/* Currency row */}
                                        <View className="flex-row items-center justify-center gap-4 mb-8">
                                            {/* From */}
                                            <TouchableOpacity
                                                onPress={() => setShowFromPicker(true)}
                                                className="flex-1 bg-white border-2 border-black rounded-2xl p-4 items-center"
                                            >
                                                <Text className="text-xs font-jb_mono_medium text-black/50 mb-1">From</Text>
                                                <Text className="text-2xl font-jb_mono_bold text-black">{fromCurrency}</Text>
                                                <Text className="text-sm font-jb_mono_medium text-black/60">{getCurrencySymbol(fromCurrency)}</Text>
                                            </TouchableOpacity>

                                            {/* Swap button */}
                                            <TouchableOpacity
                                                onPress={() => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); setConvertedAmount(null); }}
                                                className="w-12 h-12 bg-yellow border-2 border-black rounded-full items-center justify-center"
                                            >
                                                <Feather name="repeat" size={20} color="black" />
                                            </TouchableOpacity>

                                            {/* To */}
                                            <TouchableOpacity
                                                onPress={() => setShowToPicker(true)}
                                                className="flex-1 bg-white border-2 border-black rounded-2xl p-4 items-center"
                                            >
                                                <Text className="text-xs font-jb_mono_medium text-black/50 mb-1">To</Text>
                                                <Text className="text-2xl font-jb_mono_bold text-black">{toCurrency}</Text>
                                                <Text className="text-sm font-jb_mono_medium text-black/60">{getCurrencySymbol(toCurrency)}</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/* Error */}
                                        {error && (
                                            <View className="bg-background_red/20 border-2 border-background_red rounded-2xl p-4 mb-4">
                                                <Text className="text-background_red font-jb_mono_medium text-sm">{error}</Text>
                                            </View>
                                        )}

                                        {/* Result */}
                                        {convertedAmount !== null && !isLoading && (
                                            <View className="bg-yellow border-2 border-black rounded-2xl p-5 mb-6 items-center">
                                                <Text className="font-jb_mono_medium text-black/60 text-sm mb-1">
                                                    {amount} {fromCurrency} =
                                                </Text>
                                                <Text className="font-jb_mono_bold text-black text-4xl">
                                                    {getCurrencySymbol(toCurrency)}{convertedAmount.toLocaleString()}
                                                </Text>
                                                <Text className="font-jb_mono_medium text-black/60 text-sm mt-1">{toCurrency}</Text>
                                            </View>
                                        )}

                                        {/* Convert button */}
                                        {convertedAmount === null ? (
                                            <TouchableOpacity
                                                className="bg-maroon px-8 py-4 rounded-full items-center border-2 border-black mb-4"
                                                onPress={handleConvert}
                                                disabled={isLoading}
                                            >
                                                {isLoading
                                                    ? <ActivityIndicator color="white" />
                                                    : <Text className="text-white font-jb_mono_bold text-lg">Convert</Text>
                                                }
                                            </TouchableOpacity>
                                        ) : (
                                            <View className="gap-y-3">
                                                <Text className="text-center font-jb_mono_medium text-black/60 text-sm">Log this as:</Text>
                                                <View className="flex-row gap-3">
                                                    <TouchableOpacity
                                                        className="flex-1 bg-background_green border-2 border-black rounded-2xl py-4 items-center"
                                                        onPress={() => { setLogType('income'); setStep('log'); }}
                                                    >
                                                        <Feather name="trending-up" size={20} color="black" />
                                                        <Text className="font-jb_mono_bold text-black mt-1">Income</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        className="flex-1 bg-background_red border-2 border-black rounded-2xl py-4 items-center"
                                                        onPress={() => { setLogType('expense'); setStep('log'); }}
                                                    >
                                                        <Feather name="trending-down" size={20} color="black" />
                                                        <Text className="font-jb_mono_bold text-black mt-1">Expense</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => setConvertedAmount(null)}
                                                    className="items-center py-2"
                                                >
                                                    <Text className="font-jb_mono_medium text-black/50 text-sm">Convert again</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {/* Converted amount summary */}
                                        <View className="bg-yellow border-2 border-black rounded-2xl p-4 mb-6 items-center">
                                            <Text className="font-jb_mono_medium text-black/60 text-xs">{amount} {fromCurrency} =</Text>
                                            <Text className="font-jb_mono_bold text-black text-3xl">
                                                {getCurrencySymbol(toCurrency)}{convertedAmount?.toLocaleString()} {toCurrency}
                                            </Text>
                                        </View>

                                        {logType === 'income' ? (
                                            <View className="items-center gap-y-4">
                                                <Text className="font-jb_mono_medium text-black/70 text-center">
                                                    This will be logged as an income of {getCurrencySymbol(toCurrency)}{convertedAmount} {toCurrency}.
                                                </Text>
                                                <TouchableOpacity
                                                    className="bg-background_green px-10 py-4 rounded-full border-2 border-black items-center flex-row gap-3"
                                                    onPress={handleLogIncome}
                                                    disabled={isSaving}
                                                >
                                                    {isSaving
                                                        ? <ActivityIndicator color="black" />
                                                        : <>
                                                            <Feather name="check" size={20} color="black" />
                                                            <Text className="font-jb_mono_bold text-black text-lg">Save Income</Text>
                                                        </>
                                                    }
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <>
                                                <TextInput
                                                    placeholder="What was this expense for?"
                                                    placeholderTextColor="#808080"
                                                    value={expenseTitle}
                                                    onChangeText={setExpenseTitle}
                                                    className="bg-white px-6 py-4 rounded-2xl border-2 border-black font-jb_mono_medium text-lg mb-5 text-black"
                                                />

                                                <View className="flex-row flex-wrap mb-6">
                                                    {CATEGORIES.map((cat) => {
                                                        const isSelected = selectedCategory === cat.label;
                                                        return (
                                                            <TouchableOpacity
                                                                key={cat.label}
                                                                onPress={() => setSelectedCategory(isSelected ? null : cat.label)}
                                                                className={`${cat.color} flex-row items-center px-4 py-2 rounded-full mr-2 mb-2 border-2`}
                                                                style={{ borderColor: isSelected ? 'white' : 'black', opacity: !selectedCategory || isSelected ? 1 : 0.4 }}
                                                            >
                                                                {isSelected && <Feather name="check" size={14} color={cat.text === 'text-white' ? 'white' : 'black'} style={{ marginRight: 4 }} />}
                                                                <Text className={`font-jb_mono_medium text-sm ${cat.text}`}>{cat.label}</Text>
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>

                                                <TouchableOpacity
                                                    className="bg-maroon px-8 py-4 rounded-full border-2 border-black items-center flex-row justify-center gap-3"
                                                    onPress={handleLogExpense}
                                                    disabled={isSaving}
                                                >
                                                    {isSaving
                                                        ? <ActivityIndicator color="white" />
                                                        : <>
                                                            <Feather name="check" size={20} color="white" />
                                                            <Text className="text-white font-jb_mono_bold text-lg">Save Expense</Text>
                                                        </>
                                                    }
                                                </TouchableOpacity>
                                            </>
                                        )}

                                        <TouchableOpacity onPress={() => setStep('convert')} className="items-center py-4">
                                            <Text className="font-jb_mono_medium text-black/50 text-sm">← Back to converter</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <CurrencyPickerModal
                visible={showFromPicker}
                onClose={() => setShowFromPicker(false)}
                onSelect={(code) => { setFromCurrency(code); setConvertedAmount(null); }}
                selected={fromCurrency}
                title="Convert From"
            />
            <CurrencyPickerModal
                visible={showToPicker}
                onClose={() => setShowToPicker(false)}
                onSelect={(code) => { setToCurrency(code); setConvertedAmount(null); }}
                selected={toCurrency}
                title="Convert To"
            />
        </>
    );
}
