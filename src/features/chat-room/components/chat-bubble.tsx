import { cn } from '@/lib/utils';
import { memo, type FC } from 'react';
import type { ChatBubbleProps } from '../types';

const ChatBubble: FC<ChatBubbleProps> = ({
    className
}) => (
    <div className={cn(
        'px-4 py-2 rounded-md md:max-w-1/2',
        className
    )}
    >
        <p className="text-sm leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam nesciunt voluptatibus et officia adipisci quo ipsam distinctio itaque sapiente omnis, praesentium minima libero officiis ipsum hic error corrupti fuga rerum.</p>
    </div>
);

export default memo(ChatBubble);