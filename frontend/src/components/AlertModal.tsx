import { createContext, useContext, useState, ReactNode } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

type AlertButton = {
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
};

type AlertOptions = {
    title: string;
    message?: string;
    buttons?: AlertButton[];
};

type AlertContextType = {
    showAlert: (options: AlertOptions) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertModalProvider({ children }: { children: ReactNode }) {
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState<AlertOptions | null>(null);

    const showAlert = (opts: AlertOptions) => {
        setOptions(opts);
        setVisible(true);
    };

    const handlePress = (button: AlertButton) => {
        setVisible(false);
        setTimeout(() => button.onPress?.(), 200);
    };

    const buttons = options?.buttons?.length ? options.buttons : [{ text: 'OK', style: 'default' as const }];

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
                <View className="flex-1 items-center justify-center bg-black/40 px-8">
                    <View className="bg-yellow rounded-3xl border-2 border-black border-dashed p-6 w-full max-w-sm">
                        <Text className="font-rubik_bold text-lg text-center mb-2">{options?.title}</Text>
                        {options?.message && (
                            <Text className="font-rubik_regular text-sm text-center mb-6">
                                {options.message}
                            </Text>
                        )}
                        <View className={buttons.length > 1 ? 'flex-row gap-3' : 'w-full'}>
                            {buttons.map((button, index) => {
                                const isDestructive = button.style === 'destructive';
                                const isCancel = button.style === 'cancel';

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handlePress(button)}
                                        // Use w-full for single buttons, and flex-1 for side-by-side buttons
                                        className={`py-3 rounded-full items-center justify-center ${buttons.length > 1 ? 'flex-1' : 'w-full'
                                            } ${isDestructive ? 'bg-red-500' : isCancel ? 'bg-black/5' : 'bg-black'}`}
                                    >
                                        {/* Bulletproof inline color to prevent NativeWind fallback issues */}
                                        <Text
                                            className="font-rubik_bold text-sm"
                                            style={{ color: isCancel ? '#000000' : '#FFFFFF' }}
                                        >
                                            {button.text}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </View>
            </Modal>
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context.showAlert;
}