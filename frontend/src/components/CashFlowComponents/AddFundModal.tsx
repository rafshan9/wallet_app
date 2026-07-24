import { View, Text, Modal, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, ScrollView, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRef, useState, useEffect } from 'react';
import { CATEGORIES } from '../../constants/categories';
import api from '../../../utils/axios'
import { useAppStore } from '../../store'
import { useAlert } from '../AlertModal';
import ScannerButton from '../ui/ScannerButton';
import AiReviewModal from './AiReviewModal';
import { useSpeechToText } from '../../hooks/useSpeechToText';

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
    const blinkAnim = useRef(new Animated.Value(1)).current;

    const [editableTranscript, setEditableTranscript] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);

    const { isRecording, transcript, startRecording, stopRecording } = useSpeechToText();

    // Mirror the live transcript into the editable box while recording;
    // once stopped, the box is fully user-controlled (no more overwrites)
    useEffect(() => {
        if (isRecording) {
            setEditableTranscript(transcript);
        }
    }, [transcript, isRecording]);

    useEffect(() => {
        if (isRecording) {
            const blink = Animated.loop(
                Animated.sequence([
                    Animated.timing(blinkAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
                    Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                ])
            );
            blink.start();
            return () => {
                blink.stop();
                blinkAnim.setValue(1);
            };
        }
    }, [isRecording]);

    const handleVoiceResult = (expenses: { name: string; amount: number; category: string }[]) => {
        if (!expenses || expenses.length === 0) {
            showAlert({ title: 'Nothing captured', message: "Couldn't detect an expense in that. Try again." });
            return;
        }
        setScannedData(expenses);
        setReviewVisible(true);
        setType('expense');
    };

    const handleSubmitTranscript = async () => {
        if (!editableTranscript.trim()) return;
        setIsExtracting(true);
        try {
            const response = await api.post('/transactions/voice-text/', { text: editableTranscript.trim() });
            handleVoiceResult(response.data);
            setEditableTranscript('');
        } catch (error: any) {
            console.error('Extraction error:', error.response?.data);
            showAlert({ title: 'Error', message: 'Could not process that. Try again.' });
        } finally {
            setIsExtracting(false);
        }
    };

    const handleScanComplete = (data: any) => {
        setIsScanning(false);
        if (data) {
            setScannedData(data.items);
            setReviewVisible(true);
            setType('expense');
        }
    };

    const VALID_CATEGORIES = [
        'GROCERIES', 'SUBSCRIPTIONS', 'MEMBERSHIP', 'BILLS',
        'TRANSPORT', 'DINING', 'SHOPPING', 'ENTERTAINMENT', 'RENT', 'OTHER',
    ];

    const handleSaveScannedItems = async (items: { name: string; amount: number; category: string }[]) => {
        for (const item of items) {
            const normalizedCategory = VALID_CATEGORIES.includes(item.category.toUpperCase())
                ? item.category.toUpperCase()
                : 'OTHER';

            try {
                await api.post('/transactions/', {
                    type: 'EXPENSE',
                    title: item.name,
                    amount: item.amount.toString(),
                    category: normalizedCategory,
                });
            } catch (error: any) {
                console.error("Error saving:", item.name, error.response?.data);
            }
        }

        setReviewVisible(false);
        onClose();
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
            showAlert({ title: 'Error', message: 'Failed to save transaction.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <KeyboardAvoidingView behavior="padding" className="flex-1">
                <View className="flex-1 justify-end bg-black/80">
                    <View className="bg-very_dark_blue w-full rounded-t-[40px] p-8 border-2 border-black max-h-[90%]">
                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                            {(isScanning || isExtracting) && (
                                <View className="absolute inset-0 bg-very_dark_blue/80 z-50 justify-center items-center rounded-t-[40px]">
                                    <ActivityIndicator size="large" color="#fff" />
                                    <Text className="mt-4 font-inter_bold text-white text-lg">
                                        {isScanning ? 'Analyzing receipt...' : 'Extracting your expense...'}
                                    </Text>
                                </View>
                            )}

                            <View className="flex-row justify-between items-center mb-8">
                                <Text className="text-3xl font-inter_bold text-white">
                                    {type === 'expense' ? 'New Expense' : 'New Income'}
                                </Text>
                                <TouchableOpacity className="rounded-full border-2 border-black p-2 bg-yellow" onPress={onClose}>
                                    <Feather name="x" size={28} color="black" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row bg-black/30 rounded-full p-1 mb-6">
                                <TouchableOpacity
                                    onPress={() => setType('expense')}
                                    className={`flex-1 items-center py-3 rounded-full ${type === 'expense' ? 'bg-white' : ''}`}
                                >
                                    <Text className={`font-inter_black text-sm ${type === 'expense' ? 'text-black' : 'text-white/50'}`}>Expense</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { setType('income'); setSelectedCategory(null); }}
                                    className={`flex-1 items-center py-3 rounded-full ${type === 'income' ? 'bg-white' : ''}`}
                                >
                                    <Text className={`font-inter_black text-sm ${type === 'income' ? 'text-black' : 'text-white/50'}`}>Income</Text>
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
                                style={{ textAlignVertical: 'center', includeFontPadding: false, paddingVertical: 0, height: 80 }}
                            />

                            <TextInput
                                placeholder={type === 'expense' ? 'What was this for?' : 'Where did this come from?'}
                                value={title}
                                onChangeText={setTitle}
                                className="bg-white px-6 py-4 rounded-2xl border-2 border-black font-inter_medium text-lg mb-6"
                            />

                            {type === 'expense' && (
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
                                                {isSelected && (
                                                    <Feather name="check" size={14} color={cat.text === 'text-white' ? 'white' : 'black'} style={{ marginRight: 4 }} />
                                                )}
                                                <Text className={`font-inter_medium text-sm ${cat.text}`}>{cat.label}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}

                            {/* Voice transcript panel */}
                            {(isRecording || editableTranscript.length > 0) && (
                                <View className="bg-black/30 rounded-2xl p-4 mb-6">
                                    <View className="flex-row items-center mb-2">
                                        <View className={`w-2 h-2 rounded-full mr-2 ${isRecording ? 'bg-red' : 'bg-white/30'}`} />
                                        <Text className="text-white/60 font-inter_medium text-xs">
                                            {isRecording ? 'Listening...' : 'Review your transcript'}
                                        </Text>
                                    </View>
                                    <TextInput
                                        value={editableTranscript}
                                        onChangeText={setEditableTranscript}
                                        multiline
                                        editable={!isRecording}
                                        placeholder="Speak your expense..."
                                        placeholderTextColor="rgba(255,255,255,0.4)"
                                        className="text-white font-inter_medium text-base"
                                        style={{ minHeight: 50, textAlignVertical: 'top' }}
                                    />
                                    {!isRecording && editableTranscript.length > 0 && (
                                        <View className="flex-row justify-end gap-3 mt-3">
                                            <TouchableOpacity onPress={() => setEditableTranscript('')}>
                                                <Text className="text-white/60 font-inter_medium">Discard</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={handleSubmitTranscript}
                                                disabled={isExtracting}
                                                className="bg-yellow px-4 py-2 rounded-full flex-row items-center"
                                            >
                                                <Text className="text-black font-inter_bold text-sm">Submit</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}

                            <View className="flex-row justify-between items-center mb-8">
                                <View className="flex-row gap-4">
                                    <ScannerButton
                                        isScanning={isScanning}
                                        onScanStart={() => setIsScanning(true)}
                                        onScanComplete={handleScanComplete}
                                    />

                                    <TouchableOpacity
                                        onPress={isRecording ? stopRecording : startRecording}
                                        className="h-14 w-14 rounded-full items-center justify-center border-2 border-black overflow-hidden"
                                    >
                                        <Animated.View
                                            className={`absolute inset-0 rounded-full ${isRecording ? 'bg-red' : 'bg-yellow'}`}
                                            style={{ opacity: isRecording ? blinkAnim : 1 }}
                                        />
                                        <Feather name={isRecording ? 'square' : 'mic'} size={20} color="black" />
                                    </TouchableOpacity>
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