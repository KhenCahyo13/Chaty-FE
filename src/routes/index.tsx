import ChatRoom from '@/features/chat-room';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: ChatRoom,
});
