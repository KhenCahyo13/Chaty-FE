import type { useForm } from '@tanstack/react-form';
import type z from 'zod';

import type { UserList } from '@/types/user';

import type { updateProfileSchema } from './schema';

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export interface ProfileDialogViewProps {
    form: ReturnType<typeof useForm<UpdateProfileFormValues>>;
    openProfileDialog: boolean;
    setOpenProfileDialog: (open: boolean) => void;
    avatarPreviewUrl?: string;
    onAvatarFileChange: (file?: File) => void;
    profile: UserList | undefined;
    isProfileLoading: boolean;
    isProfileError: boolean;
    isUpdateProfileLoading: boolean;
}
