import { create } from 'zustand';
import { Note } from './hooks/useNotes';
import api from '../utils/axios';

interface User {
    first_name: string;
    last_name: string;
    email: string;
    username?: string;
}

interface AppState {
    user: User | null;
    setUser: (user: User | null) => void;

    isAddModalOpen: boolean;
    refreshTrigger: number;
    openModal: () => void;
    closeModal: () => void;
    triggerRefresh: () => void;

    isNoteModalOpen: boolean;
    editingNote: Note | null;
    openNoteModal: (note?: Note | null) => void;
    closeNoteModal: () => void;

    budget: number;
    spent: number;
    fetchBudget: () => Promise<void>;
    updateBudgetLocal: (newBudget: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),

    isAddModalOpen: false,
    refreshTrigger: 0,
    openModal: () => set({ isAddModalOpen: true }),
    closeModal: () => set({ isAddModalOpen: false }),
    triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),

    isNoteModalOpen: false,
    editingNote: null,
    openNoteModal: (note = null) => set({ isNoteModalOpen: true, editingNote: note }),
    closeNoteModal: () => set({ isNoteModalOpen: false, editingNote: null }),

    budget: 0,
    spent: 0,
    fetchBudget: async () => {
        try {
            const res = await api.get('/budget/');
            set({ budget: res.data.daily_budget || 0, spent: res.data.spent_today || 0 });
        } catch (error) {
            console.error('Failed to fetch budget:', error);
        }
    },
    updateBudgetLocal: (newBudget) => set({ budget: newBudget }),
}));