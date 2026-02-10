import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { IconPhone, IconSearch, IconVideo } from '@tabler/icons-react';
import { memo } from 'react';

const ChatHeader = () => (
    <div className="flex items-center justify-between bg-sidebar border-b px-4 py-4">
        <div className="flex items-center gap-x-3">
            <Avatar className="size-10">
                <AvatarFallback className="font-semibold">KH</AvatarFallback>
            </Avatar>
            <h1 className="font-medium">Khen Cahyo</h1>
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