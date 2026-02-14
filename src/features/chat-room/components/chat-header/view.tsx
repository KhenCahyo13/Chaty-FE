import { IconPhone, IconSearch, IconVideo } from '@tabler/icons-react';
import { type FC, memo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatLastSendTime } from '@/lib/datetime';
import { getInitials } from '@/lib/sentence';

import type { ChatHeaderViewProps } from './types';

const ChatHeaderView: FC<ChatHeaderViewProps> = ({
    handleStartPrivateAudioCall,
    isReceiverOnline,
    receiver,
    receiverLastSeenAt,
}) => (
    <div className="relative z-20 flex items-center justify-between border-b border-border/70 bg-background/85 px-3 py-2.5 backdrop-blur md:px-4 md:py-3">
        <div className="flex items-center gap-x-2.5">
            <Avatar className="size-9 ring-1 ring-white/60">
                {receiver?.profile && receiver.profile.avatarUrl ? (
                    <AvatarImage alt={receiver.profile.fullName} src={receiver.profile.avatarUrl} />
                ) : (
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold">
                        {getInitials(receiver?.username)}
                    </AvatarFallback>
                )}
            </Avatar>
            <div className="min-w-0 flex flex-col gap-y-0.5">
                <h1 className="truncate text-sm font-semibold capitalize">
                    {receiver?.profile?.fullName || receiver?.username}
                </h1>
                {isReceiverOnline ? (
                    <span className='text-xs text-green-500 font-medium'>Online</span>
                ) : (
                    <span className='text-xs text-muted-foreground'>
                        {receiverLastSeenAt
                            ? `Last seen at ${formatLastSendTime(receiverLastSeenAt)}`
                            : 'Offline'}
                    </span>
                )}
            </div>
        </div>
        <div className="flex items-center gap-x-2">
            <Button
                className="rounded-lg border border-transparent hover:border-border/70 hover:bg-background"
                onClick={handleStartPrivateAudioCall}
                size='icon-sm'
                variant='ghost'
            >
                <IconPhone className="size-5 text-muted-foreground" />
            </Button>
            <Button className="rounded-lg border border-transparent hover:border-border/70 hover:bg-background" size='icon-sm' variant='ghost'>
                <IconVideo className="size-5 text-muted-foreground" />
            </Button>
            <Button className="rounded-lg border border-transparent hover:border-border/70 hover:bg-background" size='icon-sm' variant='ghost'>
                <IconSearch className="size-5 text-muted-foreground" />
            </Button>
        </div>
    </div>
);

export default memo(ChatHeaderView);
