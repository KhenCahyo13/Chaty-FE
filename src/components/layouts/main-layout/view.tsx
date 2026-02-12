import { IconMoonStars, IconPlus, IconSearch, IconSettings, IconUserCircle } from '@tabler/icons-react';
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
    isFetchingNextPrivateConversationsPage,
    handleScrollPrivateConversations,
    setOpenUserListDialog,
    searchPrivateConversations,
    setSearchPrivateConversations,
}) => (
    <>
        {/* Main Layout */}
        <SidebarProvider>
            <Sidebar
                collapsible="offcanvas"
                className="bg-sidebar/90 backdrop-blur"
            >
                <div className="flex h-full border-r border-sidebar-border/70">
                    <aside className="hidden w-14 shrink-0 flex-col justify-end border-r border-sidebar-border/70 px-1.5 py-3 md:flex">
                        <div className="flex flex-col items-center gap-y-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-10 rounded-xl border border-sidebar-border/70 bg-background/80 hover:bg-background"
                                aria-label="Profile"
                            >
                                <IconUserCircle className="size-5 text-muted-foreground" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-10 rounded-xl border border-transparent hover:border-sidebar-border/80 hover:bg-background/80"
                                aria-label="Settings"
                            >
                                <IconSettings className="size-5 text-muted-foreground" />
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-10 rounded-xl border border-transparent hover:border-sidebar-border/80 hover:bg-background/80"
                                aria-label="Theme"
                            >
                                <IconMoonStars className="size-5 text-muted-foreground" />
                            </Button>
                        </div>
                    </aside>

                    <div className="flex min-w-0 flex-1 flex-col">
                        <SidebarHeader className="gap-y-3 border-b border-sidebar-border/70 px-3 py-4">
                            <div className='flex items-center justify-between gap-x-4'>
                                <div className='flex flex-col gap-y-0.5'>
                                    <h1 className="text-sm font-semibold tracking-normal md:text-base">Messages</h1>
                                    <p className="text-[11px] text-muted-foreground">Stay in sync with your conversations.</p>
                                </div>
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
                                        value={searchPrivateConversations}
                                        onChange={(e) => setSearchPrivateConversations(e.target.value)}
                                        placeholder="Search conversations..."
                                        className="h-9 rounded-lg border-sidebar-border/70 bg-background/80 pl-8 text-sm shadow-none transition-colors focus-visible:border-primary/40"
                                    />
                                </div>
                                <Button
                                    size='icon-sm'
                                    className="size-9 rounded-lg"
                                    onClick={() => setOpenUserListDialog(true)}
                                >
                                    <IconPlus className="size-4" />
                                </Button>
                            </div>
                        </SidebarHeader>
                        <SidebarContent
                            onScroll={handleScrollPrivateConversations}
                            className="gap-y-2 bg-[radial-gradient(circle_at_top_left,oklch(0.99_0.01_240)_0%,transparent_45%)] px-2 py-2"
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
                                                    key={conversation.id}
                                                    conversation={conversation}
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
            <SidebarInset className="bg-[linear-gradient(145deg,oklch(0.996_0.004_260)_0%,oklch(0.984_0.004_255)_100%)]">
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
