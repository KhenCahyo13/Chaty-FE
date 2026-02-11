import { type FC, memo } from 'react';

import { ImageTextFallback } from '@/components/fallback/image-text';
import { LoaderFallback } from '@/components/fallback/loader';
import { Input } from '@/components/ui/input';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import ChatItem from '../chat-item';
import LoginDialog from '../login-dialog';
import type { MainLayoutViewProps } from './types';
import { Badge } from '@/components/ui/badge';
import { getSocketConnectionBadgeClassName, getSocketConnectionBadgeText } from '@/lib/socket';
import { cn } from '@/lib/utils';

const MainLayoutView: FC<MainLayoutViewProps> = ({
    children,
    privateConversations,
    isPrivateConversationsLoading,
    isPrivateConversationsError,
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
                    <Input placeholder="Search chats..." />
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
                                    imageName='no-data'
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
    </>
);

export default memo(MainLayoutView);