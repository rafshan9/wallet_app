// components/ui/KeyboardAvoidingView.tsx
import { KeyboardAvoidingView as RNKCKeyboardAvoidingView } from 'react-native-keyboard-controller';
import { cssInterop } from 'nativewind';

cssInterop(RNKCKeyboardAvoidingView, { className: 'style' });

export const KeyboardAvoidingView = RNKCKeyboardAvoidingView;