import { IconPlus, IconSearch } from '@tabler/icons-react';
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
import ProfileDialog from '../profile-dialog';
import SideButtons from '../side-buttons';
import UserListDialog from '../user-list-dialog';
import type { MainLayoutViewProps } from './types';

const MainLayoutView: FC<MainLayoutViewProps> = ({
    children,
    handleScrollPrivateConversations,
    isFetchingNextPrivateConversationsPage,
    isPrivateConversationsError,
    isPrivateConversationsLoading,
    privateConversations,
    searchPrivateConversations,
    setOpenUserListDialog,
    setSearchPrivateConversations,
}) => (
    <>
        {/* Main Layout */}
        <SidebarProvider>
            <Sidebar
                className="bg-sidebar/90 backdrop-blur"
                collapsible="offcanvas"
            >
                <div className="flex h-full border-r border-sidebar-border/70">
                    <SideButtons />

                    <div className="flex min-w-0 flex-1 flex-col">
                        <SidebarHeader className="gap-y-3 border-b border-sidebar-border/70 px-3 py-4">
                            <div className='flex items-center justify-between gap-x-4'>
                                <h1 className="text-sm font-semibold tracking-normal md:text-base">Messages</h1>
                                <Badge className={cn(
                                    'rounded-full border px-2 py-0 text-[9px] font-medium uppercase tracking-[0.08em]',
                                    getSocketConnectionBadgeClassName()
                                )}>
                                    {getSocketConnectionBadgeText()}
                                </Badge>
                            </div>
                            <div className='flex items-center gap-x-2'>
                                <div className="relative flex-1">
                                    <IconSearch className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        className="h-9 rounded-lg border-sidebar-border/70 bg-background/80 pl-8 text-sm shadow-none transition-colors focus-visible:border-primary/40"
                                        onChange={(e) => setSearchPrivateConversations(e.target.value)}
                                        placeholder="Search conversations..."
                                        value={searchPrivateConversations}
                                    />
                                </div>
                                <Button
                                    className="size-9 rounded-lg"
                                    onClick={() => setOpenUserListDialog(true)}
                                    size='icon-sm'
                                >
                                    <IconPlus className="size-4" />
                                </Button>
                            </div>
                        </SidebarHeader>
                        <SidebarContent
                            className="gap-y-2 bg-[radial-gradient(circle_at_top_left,oklch(0.99_0.01_240)_0%,transparent_45%)] px-2 py-2 dark:bg-[radial-gradient(circle_at_top_left,oklch(0.28_0.02_255)_0%,transparent_45%)]"
                            onScroll={handleScrollPrivateConversations}
                        >
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
                                        <div className="flex flex-col gap-y-1.5 pb-2">
                                            {privateConversations?.map((conversation) => (
                                                <ChatItem
                                                    conversation={conversation}
                                                    key={conversation.id}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {isFetchingNextPrivateConversationsPage && (
                                        <LoaderFallback label='Loading more conversations...' />
                                    )}
                                </>
                            )}
                        </SidebarContent>
                    </div>
                </div>
            </Sidebar>
            <SidebarInset className="bg-[linear-gradient(145deg,oklch(0.996_0.004_260)_0%,oklch(0.984_0.004_255)_100%)] dark:bg-[linear-gradient(145deg,oklch(0.175_0.01_260)_0%,oklch(0.145_0.01_255)_100%)]">
                {children}
            </SidebarInset>
        </SidebarProvider>
        {/* Login Dialog */}
        <LoginDialog />
        {/* User List Dialog */}
        <UserListDialog />
        {/* Profile Dialog */}
        <ProfileDialog />
    </>
);

export default memo(MainLayoutView);
