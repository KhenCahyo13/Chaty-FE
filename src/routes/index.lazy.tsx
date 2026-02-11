import { createLazyFileRoute } from '@tanstack/react-router';

import ChatRoom from '@/features/chat-room';

export const Route = createLazyFileRoute('/')({
    component: ChatRoom,
});
