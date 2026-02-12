import { type FC,memo } from 'react';

import { ImageTextFallback } from '@/components/fallback/image-text';
import { LoaderFallback } from '@/components/fallback/loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

import type { UserListDialogViewProps } from './types';

const UserListDialogView: FC<UserListDialogViewProps> = ({
    openUserListDialog,
    setOpenUserListDialog,
    users,
    isLoading,
    isError,
}) => (
    <Dialog open={openUserListDialog} onOpenChange={setOpenUserListDialog}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>User List</DialogTitle>
                <DialogDescription className="text-muted-foreground">Let's start a new messages with your friend</DialogDescription>
            </DialogHeader>
            <Separator />
            {isLoading ? (
                <div className='h-64 flex items-center justify-center'>
                    <LoaderFallback label='Waiting for users data...' />
                </div>
            ) : isError ? (
                <div className='h-64 flex items-center justify-center'>
                    <ImageTextFallback
                        imageName='error'
                        label='Something went error while fetching users data.'
                    />
                </div>
            ) : (
                <div className='flex flex-col max-h-96 overflow-y-scroll'>
                    {users && users.length === 0 ? (
                        <div className='h-64 flex items-center justify-center'>
                            <ImageTextFallback
                                imageName='no-data'
                                label='No users found.'
                            />
                        </div>
                    ) : (
                        users?.map((user) => (
                            <div
                                key={user.id}
                                className='py-3 px-2 flex items-center gap-x-4 cursor-pointer hover:bg-accent rounded-md'
                            >
                                <Avatar className='size-10'>
                                    {user.profile && user.profile.avatarUrl ? (
                                        <AvatarImage src={user.profile.avatarUrl} alt={user.profile.fullName} />
                                    ) : (
                                        <AvatarFallback className="font-semibold text-sm">
                                            {user.username.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className='flex flex-col'>
                                    <p className='capitalize text-sm font-medium'>{user.profile?.fullName || user.username}</p>
                                    <p className='text-xs text-muted-foreground'>{user.email}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </DialogContent>
    </Dialog>
);

export default memo(UserListDialogView);