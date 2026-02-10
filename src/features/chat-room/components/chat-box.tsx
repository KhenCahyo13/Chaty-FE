import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IconMicrophone, IconPlus } from '@tabler/icons-react';
import { memo } from 'react';

const ChatBox = () => (
    <div className="bg-sidebar border-t shrink-0">
        <div className="flex items-center gap-x-4 px-4 py-4">
            <Button variant='ghost' size='icon'>
                <IconPlus className="size-6 text-muted-foreground" />
            </Button>
            <div className="flex flex-1">
                <Input placeholder="Type a message..." />
            </div>
            <Button variant='ghost' size='icon'>
                <IconMicrophone className="size-6 text-muted-foreground" />
            </Button>
        </div>
    </div>
);

export default memo(ChatBox);