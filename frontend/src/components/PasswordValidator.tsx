// components/PasswordValidator.tsx
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Props = {
    password: string;
};

// Define the internal requirement items component
function ValidationItem({ label, isMet }: { label: string; isMet: boolean }) {

    // Define the style variants based on whether the requirement is met
    const containerBg = isMet ? 'bg-background_green' : 'bg-red';
    const textColor = isMet ? 'text-white' : 'text-white/50';
    const iconName = isMet ? 'check' : 'x';
    const iconColor = isMet ? 'black' : 'white';

    return (
        <View className="flex-row items-center mb-3">
            {/* The Retro Checkbox with Solid Shadow */}
            <View className="relative w-7 h-7 mr-3">
                {/* The Shadow */}
                <View className="absolute top-1 left-1 w-7 h-7 bg-black" />

                {/* The Box itself (colors animate red <-> green based on isMet) */}
                <View className={`absolute inset-0 border-2 border-black items-center justify-center ${containerBg}`}>
                    <Feather name={iconName} size={16} color={iconColor} />
                </View>
            </View>

            {/* The Requirement Text */}
            <Text className={`font-inter_bold text-sm ${textColor}`}>
                {label}
            </Text>
        </View>
    );
}

export default function PasswordValidator({ password }: Props) {
    // 1. Calculate validity based on regex matching your backend validators

    // Minimum 8 characters
    const hasMinLength = password.length >= 8;

    // At least one uppercase letter [A-Z]
    const hasUpperCase = /[A-Z]/.test(password);

    // At least one lowercase letter [a-z]
    const hasLowerCase = /[a-z]/.test(password);

    // At least one symbol (matching your backend validators regex)
    const hasSymbol = /[()[\]{}|\\`~!@#$%^&*_\-+=;:'",<>./?]/.test(password);

    // If no password is typed, don't show the checklist
    if (password.length === 0) return null;

    return (
        <View className="p-4 bg-black/10 rounded-2xl mb-6">
            <Text className="font-inter_black text-xs uppercase text-white/70 mb-4 tracking-widest">
                Password Strength
            </Text>

            <ValidationItem label="At least 8 characters" isMet={hasMinLength} />
            <ValidationItem label="One uppercase letter" isMet={hasUpperCase} />
            <ValidationItem label="One lowercase letter" isMet={hasLowerCase} />
            <ValidationItem label="One symbol (!@#$%^&*...)" isMet={hasSymbol} />
        </View>
    );
}