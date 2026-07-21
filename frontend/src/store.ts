import { create } from 'zustand';
import { Note } from './hooks/useNotes';

interface User {
    first_name: string;
    last_name: string;
    email: string;
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
}));