import { IconPhone, IconSearch, IconVideo } from '@tabler/icons-react';
import { memo, type FC } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { ChatHeaderProps } from '../types';

const ChatHeader: FC<ChatHeaderProps> = ({
    receiver
}) => (
    <div className="flex items-center justify-between bg-sidebar border-b px-4 py-4">
        <div className="flex items-center gap-x-3">
            <Avatar className="size-10">
                {receiver?.profile && receiver.profile.avatarUrl ? (
                    <AvatarImage src={receiver.profile.avatarUrl} alt={receiver.profile.fullName} />
                ) : (
                    <AvatarFallback className="font-semibold">
                        {receiver?.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                )}
            </Avatar>
            <h1 className="font-medium capitalize">{receiver?.profile?.fullName || receiver?.username}</h1>
        </div>
        <div className="flex items-center gap-x-3">
            <Button variant='ghost' size='icon'>
                <IconPhone className="size-6 text-muted-foreground" />
            </Button>
            <Button variant='ghost' size='icon'>
                <IconVideo className="size-6 text-muted-foreground" />
            </Button>
            <Button variant='ghost' size='icon'>
                <IconSearch className="size-6 text-muted-foreground" />
            </Button>
        </div>
    </div>
);

export default memo(ChatHeader);