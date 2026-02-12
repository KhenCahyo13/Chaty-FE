import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { fetchProfile, updateProfile } from '@/api/me';
import { queryKeys } from '@/lib/query-keys';
import { resolveErrorMessage } from '@/lib/response';
import { useComponentsStore } from '@/stores/components';

import { updateProfileSchema, updateProfileSchemaDefaultValues } from './schema';
import type { UpdateProfileFormValues } from './types';
import ProfileDialogView from './view';

const ProfileDialog = () => {
    const { openProfileDialog, setOpenProfileDialog } = useComponentsStore();
    const queryClient = useQueryClient();
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | undefined>(undefined);

    const { data: profile, isError: isProfileError, isLoading: isProfileLoading } = useQuery({
        enabled: openProfileDialog,
        queryFn: () => fetchProfile(),
        queryKey: queryKeys.me.profile(),
    });

    const updateProfileMutation = useMutation({
        mutationFn: (data: UpdateProfileFormValues) => updateProfile(data),
        onError: (error) => {
            toast.error(resolveErrorMessage(error));
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: queryKeys.me.profile(),
            });

            form.setFieldValue('avatar', undefined);
            setAvatarPreviewUrl((prev) => {
                if (prev) {
                    URL.revokeObjectURL(prev);
                }

                return undefined;
            });
            toast.success('Profile updated successfully.');
        },
    });

    const form = useForm({
        defaultValues: updateProfileSchemaDefaultValues,
        onSubmit: ({ value }) => {
            updateProfileMutation.mutate(value);
        },
        validators: {
            onSubmit: updateProfileSchema,
        },
    });

    const handleOpenProfileDialogChange = (open: boolean) => {
        setOpenProfileDialog(open);

        if (!open) {
            form.reset();
            setAvatarPreviewUrl((prev) => {
                if (prev) {
                    URL.revokeObjectURL(prev);
                }

                return undefined;
            });
        }
    };

    const handleAvatarFileChange = (file?: File) => {
        setAvatarPreviewUrl((prev) => {
            if (prev) {
                URL.revokeObjectURL(prev);
            }

            return file ? URL.createObjectURL(file) : undefined;
        });
    };

    useEffect(() => {
        if (openProfileDialog && profile?.data) {
            form.setFieldValue('fullName', profile.data.profile?.fullName || '');
            form.setFieldValue('about', profile.data.profile?.about || '');
            form.setFieldValue('avatar', undefined);
        }
    }, [openProfileDialog, profile, form]);

    useEffect(() => {
        return () => {
            if (avatarPreviewUrl) {
                URL.revokeObjectURL(avatarPreviewUrl);
            }
        };
    }, [avatarPreviewUrl]);

    return <ProfileDialogView
        avatarPreviewUrl={avatarPreviewUrl}
        form={form}
        isProfileError={isProfileError}
        isProfileLoading={isProfileLoading}
        isUpdateProfileLoading={updateProfileMutation.isPending}
        onAvatarFileChange={handleAvatarFileChange}
        openProfileDialog={openProfileDialog}
        profile={profile?.data}
        setOpenProfileDialog={handleOpenProfileDialogChange}
    />;
};

export default ProfileDialog;
