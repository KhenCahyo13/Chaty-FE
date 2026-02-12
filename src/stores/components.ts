import { create } from 'zustand';

export interface ComponentsStateStore {
    openUserListDialog: boolean;
    setOpenUserListDialog: (open: boolean) => void;
}

export const useComponentsStore = create<ComponentsStateStore>((set) => ({
    openUserListDialog: false,
    setOpenUserListDialog: (open: boolean) => set({ openUserListDialog: open }),
}));
