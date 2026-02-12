import { IconPencil } from '@tabler/icons-react';
import { type FC, memo } from 'react';

import { ImageTextFallback } from '@/components/fallback/image-text';
import { LoaderFallback } from '@/components/fallback/loader';
import { TfSubmitButton } from '@/components/tanstack-form/button';
import { TfTextInput } from '@/components/tanstack-form/text-input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FieldError, FieldGroup } from '@/components/ui/field';
import type { FormFileFieldState } from '@/types/components';

import type { ProfileDialogViewProps } from './types';

const ProfileDialogView: FC<ProfileDialogViewProps> = ({
    form,
    openProfileDialog,
    setOpenProfileDialog,
    avatarPreviewUrl,
    onAvatarFileChange,
    profile,
    isProfileLoading,
    isProfileError,
    isUpdateProfileLoading,
}) => {
    const avatarUrl = avatarPreviewUrl || profile?.profile?.avatarUrl || undefined;

    return (
        <Dialog open={openProfileDialog} onOpenChange={setOpenProfileDialog}>
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
                                                htmlFor={field.name}
                                                className={`cursor-pointer ${isUpdateProfileLoading ? 'pointer-events-none opacity-60' : ''}`}
                                            >
                                                <div className='relative inline-flex'>
                                                    <Avatar className='size-14 ring-1 ring-white/70 transition hover:opacity-90'>
                                                        {avatarUrl ? (
                                                            <AvatarImage src={avatarUrl} alt={profile?.profile?.fullName || profile?.username || 'Profile avatar'} className='object-cover' />
                                                        ) : (
                                                            <AvatarFallback className='bg-primary/10 text-base font-semibold'>
                                                                {profile?.username.slice(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <span className='bg-background absolute -bottom-1 -right-1 inline-flex size-6 items-center justify-center rounded-full border shadow-sm'>
                                                        <IconPencil className='size-4' />
                                                    </span>
                                                </div>
                                            </label>
                                            <input
                                                id={field.name}
                                                type='file'
                                                name={field.name}
                                                className='sr-only'
                                                accept='image/jpg,image/jpeg,image/png,image/webp'
                                                onBlur={field.handleBlur}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];

                                                    field.handleChange(file);
                                                    onAvatarFileChange(file);
                                                }}
                                                aria-invalid={isInvalid}
                                                disabled={isUpdateProfileLoading}
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
                                    required
                                    form={form}
                                    label='Full Name'
                                    placeholder='Enter your full name'
                                    name='fullName'
                                    disabled={isUpdateProfileLoading}
                                />
                                <TfTextInput
                                    form={form}
                                    label='About'
                                    placeholder='Enter about yourself'
                                    name='about'
                                    disabled={isUpdateProfileLoading}
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
