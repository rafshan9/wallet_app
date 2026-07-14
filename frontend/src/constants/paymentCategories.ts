// constants/paymentCategories.ts
import { Feather } from '@expo/vector-icons';

export type PaymentCategory = 'housing' | 'subscription' | 'utility' | 'insurance' | 'transport' | 'other';

export const CATEGORY_STYLES: Record<PaymentCategory, { icon: keyof typeof Feather.glyphMap; bg: string; label: string }> = {
    housing: { icon: 'home', bg: 'bg-dark_blue', label: 'Housing' },
    subscription: { icon: 'tv', bg: 'bg-teal', label: 'Subscription' },
    utility: { icon: 'zap', bg: 'bg-yellow', label: 'Utility' },
    insurance: { icon: 'shield', bg: 'bg-orange', label: 'Insurance' },
    transport: { icon: 'truck', bg: 'bg-light_blue', label: 'Transport' },
    other: { icon: 'credit-card', bg: 'bg-maroon', label: 'Other' },
};

export const FREQUENCIES = ['weekly', 'monthly', 'yearly'] as const;