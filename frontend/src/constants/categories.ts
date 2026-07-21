import GroceriesIcon from '../../assets/icons/groceries_icon.svg';
import SubscriptionsIcon from '../../assets/icons/subscription_icon.svg';
import MembershipIcon from '../../assets/icons/membership_icon.svg';
import BillsIcon from '../../assets/icons/bills_icon.svg';
import TransportIcon from '../../assets/icons/transport_icon.svg';
import DiningIcon from '../../assets/icons/dining_icon.svg';
import ShoppingIcon from '../../assets/icons/shopping_icon.svg';
import EntertainmentIcon from '../../assets/icons/entertainment_icon.svg';
import RentIcon from '../../assets/icons/rent_icon.svg';

export const CATEGORIES = [
    { label: 'Groceries', color: 'bg-background_green', text: 'text-black', icon: GroceriesIcon },
    { label: 'Subscriptions', color: 'bg-teal', text: 'text-black', icon: SubscriptionsIcon },
    { label: 'Membership', color: 'bg-maroon', text: 'text-white', icon: MembershipIcon },
    { label: 'Bills', color: 'bg-orange', text: 'text-black', icon: BillsIcon },
    { label: 'Transport', color: 'bg-light_blue', text: 'text-black', icon: TransportIcon },
    { label: 'Dining', color: 'bg-red', text: 'text-white', icon: DiningIcon },
    { label: 'Shopping', color: 'bg-yellow', text: 'text-black', icon: ShoppingIcon },
    { label: 'Entertainment', color: 'bg-black', text: 'text-white', icon: EntertainmentIcon },
    { label: 'Rent', color: 'bg-dark_blue', text: 'text-white', icon: RentIcon },
];

export function getCategoryStyle(label: string) {
    return CATEGORIES.find((cat) => cat.label === label) ?? { label, color: 'bg-gray-300', text: 'text-black' };
}