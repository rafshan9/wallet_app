export const CATEGORIES = [
    { label: 'Groceries', color: 'bg-green', text: 'text-white' },
    { label: 'Subscriptions', color: 'bg-teal', text: 'text-black' },
    { label: 'Membership', color: 'bg-maroon', text: 'text-white' },
    { label: 'Bills', color: 'bg-orange', text: 'text-black' },
    { label: 'Transport', color: 'bg-light_blue', text: 'text-black' },
    { label: 'Dining', color: 'bg-red', text: 'text-white' },
    { label: 'Shopping', color: 'bg-yellow', text: 'text-black' },
    { label: 'Entertainment', color: 'bg-black', text: 'text-white' },
    { label: 'Rent', color: 'bg-dark_blue', text: 'text-white' },
];

export function getCategoryStyle(label: string) {
    return CATEGORIES.find((cat) => cat.label === label) ?? { label, color: 'bg-gray-300', text: 'text-black' };
}