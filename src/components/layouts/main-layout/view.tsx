import { memo, type FC } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import type { LayoutProps } from '@/types/components';
import ChatItem from '../chat-item';
import LoginDialog from '../login-dialog';

const MainLayoutView: FC<LayoutProps> = ({
    children
}) => (
    <>
        {/* Main Layout */}
        <SidebarProvider>
            <Sidebar collapsible="offcanvas">
                <SidebarHeader className="px-4 py-4">
                    <h1 className="font-semibold md:text-lg">Your Chats</h1>
                    <Input placeholder="Search chats..." />
                </SidebarHeader>
                <SidebarContent>
                    <div className="flex flex-col gap-y-2">
                        {Array.from({ length: 15 }).map((_, index) => (
                            <ChatItem
                                key={index}
                            />
                        ))}
                    </div>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
        {/* Login Dialog */}
        {/* <LoginDialog /> */}
    </>
);

export default memo(MainLayoutView);