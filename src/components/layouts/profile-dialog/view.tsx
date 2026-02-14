import { IconPencil } from '@tabler/icons-react';
import { type FC, memo } from 'react';

import { ImageTextFallback } from '@/components/fallback/image-text';
import { LoaderFallback } from '@/components/fallback/loader';
import { TfSubmitButton } from '@/components/tanstack-form/button';
import { TfTextInput } from '@/components/tanstack-form/text-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { getInitials } from '@/lib/sentence';
import type { FormFileFieldState } from '@/types/components';

import type { ProfileDialogViewProps } from './types';

const ProfileDialogView: FC<ProfileDialogViewProps> = ({
    avatarPreviewUrl,
    form,
    isProfileError,
    isProfileLoading,
    isUpdateProfileLoading,
    onAvatarFileChange,
    openProfileDialog,
    profile,
    setOpenProfileDialog,
}) => {
    const avatarUrl = avatarPreviewUrl || profile?.profile?.avatarUrl || undefined;

    return (
        <Dialog onOpenChange={setOpenProfileDialog} open={openProfileDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='sr-only'>Profile</DialogTitle>
                    <DialogDescription className='sr-only'>This is your profile dialog.</DialogDescription>
                </DialogHeader>
                {isProfileLoading ? (
                    <LoaderFallback label='Waiting for profile data...' />
                ) : isProfileError ? (
                    <ImageTextFallback
                        imageName='error'
                        label='Something went error while fetching your profile data.'
                    />
                ) : (
                    <>
                        <div className='flex flex-col items-center gap-y-4'>
                            <form.Field name='avatar'>
                                {(field: FormFileFieldState) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;

                                    return (
                                        <div className='flex flex-col items-center gap-y-2'>
                                            <label
                                                className={`cursor-pointer ${isUpdateProfileLoading ? 'pointer-events-none opacity-60' : ''}`}
                                                htmlFor={field.name}
                                            >
                                                <div className='relative inline-flex'>
                                                    <Avatar className='size-14 ring-1 ring-white/70 transition hover:opacity-90'>
                                                        {avatarUrl ? (
                                                            <AvatarImage alt={profile?.profile?.fullName || profile?.username || 'Profile avatar'} className='object-cover' src={avatarUrl} />
                                                        ) : (
                                                            <AvatarFallback className='bg-primary/10 text-base font-semibold'>
                                                                {getInitials(profile?.username)}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <span className='bg-background absolute -bottom-1 -right-1 inline-flex size-6 items-center justify-center rounded-full border shadow-sm'>
                                                        <IconPencil className='size-4' />
                                                    </span>
                                                </div>
                                            </label>
                                            <input
                                                accept='image/jpg,image/jpeg,image/png,image/webp'
                                                aria-invalid={isInvalid}
                                                className='sr-only'
                                                disabled={isUpdateProfileLoading}
                                                id={field.name}
                                                name={field.name}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];

                                                    field.handleChange(file);
                                                    onAvatarFileChange(file);
                                                }}
                                                type='file'
                                            />
                                            {isInvalid && (
                                                <FieldError className='text-center' errors={field.state.meta.errors} />
                                            )}
                                        </div>
                                    );
                                }}
                            </form.Field>
                            <div className='flex flex-col items-center gap-y-1'>
                                <p className='font-semibold capitalize'>{profile?.profile?.fullName || profile?.username}</p>
                                <p className='text-sm text-muted-foreground'>{profile?.profile?.about ?? '-'}</p>
                            </div>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.handleSubmit();
                            }}
                        >
                            <FieldGroup>
                                <TfTextInput
                                    disabled={isUpdateProfileLoading}
                                    form={form}
                                    label='Full Name'
                                    name='fullName'
                                    placeholder='Enter your full name'
                                    required
                                />
                                <TfTextInput
                                    disabled={isUpdateProfileLoading}
                                    form={form}
                                    label='About'
                                    name='about'
                                    placeholder='Enter about yourself'
                                />
                                <TfSubmitButton isLoading={isUpdateProfileLoading}>Save</TfSubmitButton>
                            </FieldGroup>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default memo(ProfileDialogView);
