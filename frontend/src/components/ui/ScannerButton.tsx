import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { analyzeReceipt } from '../../../utils/gemini';

interface ScannerButtonProps {
    isScanning: boolean;
    onScanStart: () => void;
    onScanComplete: (data: any) => void;
}

export default function ScannerButton({ isScanning, onScanStart, onScanComplete }: ScannerButtonProps) {
    const handleScan = async () => {
        if (isScanning) return;

        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') return;

        const result = await ImagePicker.launchCameraAsync({
            base64: true,
            quality: 0.5,
        });

        if (!result.canceled && result.assets[0].base64) {
            try {
                onScanStart();
                const data = await analyzeReceipt(result.assets[0].base64);
                onScanComplete(data);
            } catch (error) {
                console.error("Failed to parse receipt:", error);
                onScanComplete(null);
            }
        }
    };

    return (
        <TouchableOpacity
            onPress={handleScan}
            disabled={isScanning}
            className={`h-14 w-14 rounded-full justify-center items-center border-2 border-black shadow-sm ${isScanning ? 'bg-gray-500' : 'bg-yellow'}`}
        >
            <Feather name="camera" size={24} color={isScanning ? 'white' : 'black'} />
        </TouchableOpacity>
    );
}