import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { memo } from 'react';

const ChatItemView = () => (
    <div className="px-4 py-2 flex items-center gap-x-4 cursor-pointer hover:bg-accent">
        <Avatar className="size-12">
            <AvatarFallback className="font-semibold md:text-lg">KH</AvatarFallback>
        </Avatar>
        <div className="w-full flex flex-col gap-y-1">
            <div className="flex items-center justify-between">
                <p className="font-medium">Khen Cahyo</p>
                <span className="text-sm text-muted-foreground">13:00</span>
            </div>
            <div className="text-sm text-muted-foreground">
                <p>This is a sample chat message preview.</p>
            </div>
        </div>
    </div>
);

export default memo(ChatItemView);