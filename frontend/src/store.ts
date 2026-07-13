import { create } from 'zustand';

interface AppState {
    isAddModalOpen: boolean;
    refreshTrigger: number; // We change this number to trigger data fetches
    openModal: () => void;
    closeModal: () => void;
    triggerRefresh: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    isAddModalOpen: false,
    refreshTrigger: 0,
    openModal: () => set({ isAddModalOpen: true }),
    closeModal: () => set({ isAddModalOpen: false }),
    triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));