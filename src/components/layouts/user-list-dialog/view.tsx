import { type FC, memo } from 'react';

import { ImageTextFallback } from '@/components/fallback/image-text';
import { LoaderFallback } from '@/components/fallback/loader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import type { UserListDialogViewProps } from './types';

const UserListDialogView: FC<UserListDialogViewProps> = ({
    handleCreatePrivateConversation,
    handleScrollUsers,
    isCreatePrivateConversationLoading,
    isError,
    isFetchingNextUsersPage,
    isLoading,
    openUserListDialog,
    searchUsers,
    setOpenUserListDialog,
    setSearchUsers,
    users,
}) => (
    <Dialog onOpenChange={setOpenUserListDialog} open={openUserListDialog}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>User List</DialogTitle>
                <DialogDescription className="text-muted-foreground">Let's start a new messages with your friend</DialogDescription>
            </DialogHeader>
            <Input
                onChange={(e) => setSearchUsers(e.target.value)}
                placeholder='Search users...'
                value={searchUsers}
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
                <div
                    className='flex flex-col gap-y-2 max-h-96 overflow-y-scroll'
                    onScroll={handleScrollUsers}
                >
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
                                className='justify-start h-14 px-2 gap-x-3 cursor-pointer'
                                disabled={isCreatePrivateConversationLoading}
                                key={user.id}
                                onClick={() => handleCreatePrivateConversation(user.id)}
                                variant='ghost'
                            >
                                <Avatar className='size-10'>
                                    {user.profile && user.profile.avatarUrl ? (
                                        <AvatarImage
                                            alt={user.profile.fullName}
                                            decoding="async"
                                            loading="lazy"
                                            src={user.profile.avatarUrl}
                                        />
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
                    {isFetchingNextUsersPage && (
                        <LoaderFallback label='Loading more users...' />
                    )}
                </div>
            )}
        </DialogContent>
    </Dialog>
);

export default memo(UserListDialogView);
