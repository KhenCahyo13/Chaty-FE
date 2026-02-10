import ChatRoom from '@/features/chat-room';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
    component: ChatRoom,
});
