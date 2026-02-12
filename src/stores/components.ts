import { create } from 'zustand';

export interface ComponentsStateStore {
    openProfileDialog: boolean;
    openUserListDialog: boolean;
    setOpenProfileDialog: (open: boolean) => void;
    setOpenUserListDialog: (open: boolean) => void;
}

export const useComponentsStore = create<ComponentsStateStore>((set) => ({
    openProfileDialog: false,
    openUserListDialog: false,
    setOpenProfileDialog: (open: boolean) => set({ openProfileDialog: open }),
    setOpenUserListDialog: (open: boolean) => set({ openUserListDialog: open }),
}));
