import { create } from 'zustand';

export interface ComponentsStateStore {
    openUserListDialog: boolean;
    openProfileDialog: boolean;
    setOpenUserListDialog: (open: boolean) => void;
    setOpenProfileDialog: (open: boolean) => void;
}

export const useComponentsStore = create<ComponentsStateStore>((set) => ({
    openUserListDialog: false,
    openProfileDialog: false,
    setOpenUserListDialog: (open: boolean) => set({ openUserListDialog: open }),
    setOpenProfileDialog: (open: boolean) => set({ openProfileDialog: open }),
}));
