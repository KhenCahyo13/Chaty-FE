import { IconPlus } from '@tabler/icons-react';
import { type FC, memo } from 'react';

import { ImageTextFallback } from '@/components/fallback/image-text';
import { LoaderFallback } from '@/components/fallback/loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getSocketConnectionBadgeClassName, getSocketConnectionBadgeText } from '@/lib/socket';
import { cn } from '@/lib/utils';

import ChatItem from '../chat-item';
import LoginDialog from '../login-dialog';
import UserListDialog from '../user-list-dialog';
import type { MainLayoutViewProps } from './types';

const MainLayoutView: FC<MainLayoutViewProps> = ({
    children,
    privateConversations,
    isPrivateConversationsLoading,
    isPrivateConversationsError,
    setOpenUserListDialog,
}) => (
    <>
        {/* Main Layout */}
        <SidebarProvider>
            <Sidebar collapsible="offcanvas">
                <SidebarHeader className="px-4 py-4">
                    <div className='flex items-center justify-between'>
                        <h1 className="font-semibold md:text-lg">Your Chats</h1>
                        <Badge className={cn(
                            getSocketConnectionBadgeClassName()
                        )}>
                            {getSocketConnectionBadgeText()}
                        </Badge>
                    </div>
                    <div className='flex items-center gap-x-2'>
                        <Input placeholder="Search chats..." />
                        <Button size='icon-sm' onClick={() => setOpenUserListDialog(true)}>
                            <IconPlus />
                        </Button>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    {isPrivateConversationsLoading ? (
                        <LoaderFallback label='Waiting for conversations data...' />
                    ) : isPrivateConversationsError ? (
                        <ImageTextFallback
                            imageClassName='w-40'
                            imageName='error'
                            label='Something went wrong while fetching conversations.'
                        />
                    ) : (
                        <>
                            {privateConversations && privateConversations.length === 0 ? (
                                <ImageTextFallback
                                    imageClassName='w-40'
                                    imageName='empty'
                                    label="Let's start a new conversation."
                                />
                            ) : (
                                <div className="flex flex-col gap-y-2">
                                    {privateConversations?.map((conversation) => (
                                        <ChatItem
                                            key={conversation.id}
                                            conversation={conversation}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
        {/* Login Dialog */}
        <LoginDialog />
        {/* User List Dialog */}
        <UserListDialog />
    </>
);

export default memo(MainLayoutView);