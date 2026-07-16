import { create } from 'zustand';
import { Note } from './hooks/useNotes';

interface AppState {
    isAddModalOpen: boolean;
    refreshTrigger: number; // We change this number to trigger data fetches
    openModal: () => void;
    closeModal: () => void;
    triggerRefresh: () => void;

    isNoteModalOpen: boolean;
    editingNote: Note | null; // null = creating a new note, set = editing an existing one
    openNoteModal: (note?: Note | null) => void;
    closeNoteModal: () => void;
}

export const useAppStore = create<AppState>((set) => ({
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