import { IconPhone, IconSearch, IconVideo } from '@tabler/icons-react';
import { type FC,memo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import type { ChatHeaderProps } from '../types';

const ChatHeader: FC<ChatHeaderProps> = ({
    receiver
}) => (
    <div className="relative z-20 flex items-center justify-between border-b border-border/70 bg-background/85 px-3 py-2.5 backdrop-blur md:px-4 md:py-3">
        <div className="flex items-center gap-x-2.5">
            <Avatar className="size-9 ring-1 ring-white/60">
                {receiver?.profile && receiver.profile.avatarUrl ? (
                    <AvatarImage src={receiver.profile.avatarUrl} alt={receiver.profile.fullName} />
                ) : (
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold">
                        {receiver?.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                )}
            </Avatar>
            <div className="min-w-0">
                <h1 className="truncate text-sm font-semibold capitalize">
                    {receiver?.profile?.fullName || receiver?.username}
                </h1>
                {/* <Badge variant="secondary" className="mt-0.5 rounded-full px-1.5 py-0 text-[9px] font-medium">
                    Active chat
                </Badge> */}
            </div>
        </div>
        <div className="flex items-center gap-x-2">
            <Button variant='ghost' size='icon-sm' className="rounded-lg border border-transparent hover:border-border/70 hover:bg-background">
                <IconPhone className="size-5 text-muted-foreground" />
            </Button>
            <Button variant='ghost' size='icon-sm' className="rounded-lg border border-transparent hover:border-border/70 hover:bg-background">
                <IconVideo className="size-5 text-muted-foreground" />
            </Button>
            <Button variant='ghost' size='icon-sm' className="rounded-lg border border-transparent hover:border-border/70 hover:bg-background">
                <IconSearch className="size-5 text-muted-foreground" />
            </Button>
        </div>
    </div>
);

export default memo(ChatHeader);
