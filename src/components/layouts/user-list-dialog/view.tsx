import { type FC,memo } from 'react';

import { ImageTextFallback } from '@/components/fallback/image-text';
import { LoaderFallback } from '@/components/fallback/loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import type { UserListDialogViewProps } from './types';

const UserListDialogView: FC<UserListDialogViewProps> = ({
    openUserListDialog,
    setOpenUserListDialog,
    users,
    isLoading,
    isError,
    handleCreatePrivateConversation,
    isCreatePrivateConversationLoading,
    searchUsers,
    setSearchUsers,
}) => (
    <Dialog open={openUserListDialog} onOpenChange={setOpenUserListDialog}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>User List</DialogTitle>
                <DialogDescription className="text-muted-foreground">Let's start a new messages with your friend</DialogDescription>
            </DialogHeader>
            <Input
                placeholder='Search users...'
                value={searchUsers}
                onChange={(e) => setSearchUsers(e.target.value)}
            />
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
                <div className='flex flex-col gap-y-2 max-h-96 overflow-y-scroll'>
                    {users && users.length === 0 ? (
                        <div className='h-64 flex items-center justify-center'>
                            <ImageTextFallback
                                imageName='empty'
                                label='No users found.'
                            />
                        </div>
                    ) : (
                        users?.map((user) => (
                            <Button
                                key={user.id}
                                variant='ghost'
                                className='justify-start h-14 px-2 gap-x-3 cursor-pointer'
                                disabled={isCreatePrivateConversationLoading}
                                onClick={() => handleCreatePrivateConversation(user.id)}
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
                                <div className='flex flex-col items-start'>
                                    <p className='capitalize text-sm font-medium'>{user.profile?.fullName || user.username}</p>
                                    <p className='text-xs text-muted-foreground'>{user.email}</p>
                                </div>
                            </Button>
                        ))
                    )}
                </div>
            )}
        </DialogContent>
    </Dialog>
);

export default memo(UserListDialogView);