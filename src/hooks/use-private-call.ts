import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { getInitials } from '@/lib/sentence';
import { socket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth-store';
import { useComponentsStore } from '@/stores/components';
import { usePrivateCallStore } from '@/stores/private-call-store';
import type { PrivateConversationList } from '@/types/private-conversation';
import type {
    SocketErrorPayload,
    SocketPrivateCallAnsweredPayload,
    SocketPrivateCallEndedPayload,
    SocketPrivateCallPayload,
} from '@/types/realtime';

interface UsePrivateCallProps {
    privateConversations: PrivateConversationList[] | undefined;
}

export const usePrivateCall = ({
    privateConversations,
}: UsePrivateCallProps) => {
    const { user } = useAuthStore();
    const { setOpenCallDialog } = useComponentsStore();
    const { clearActivePrivateCall, setActivePrivateCall } =
        usePrivateCallStore();

    const privateConversationMap = useMemo(() => {
        return new Map(
            (privateConversations ?? []).map((item) => [item.id, item])
        );
    }, [privateConversations]);

    useEffect(() => {
        if (!user?.id) return;

        const getPeerIdentity = (
            data: SocketPrivateCallPayload,
            peerId: string
        ): { initials: string; name: string } => {
            const conversation = privateConversationMap.get(
                data.private_conversation_id
            );

            if (conversation?.sender.id === peerId) {
                const displayName =
                    conversation.sender.profile?.fullName ??
                    conversation.sender.username;

                return {
                    initials: getInitials(displayName),
                    name: displayName,
                };
            }

            return {
                initials: 'U',
                name: 'Unknown User',
            };
        };

        const handleCallStarted = (
            data: SocketPrivateCallPayload,
            isIncoming: boolean
        ) => {
            const peerId =
                data.caller_id === user.id ? data.callee_id : data.caller_id;
            const peerIdentity = getPeerIdentity(data, peerId);

            setActivePrivateCall({
                calleeId: data.callee_id,
                callerId: data.caller_id,
                callId: data.call_id,
                callType: data.call_type,
                isIncoming,
                peerId,
                peerInitials: peerIdentity.initials,
                peerName: peerIdentity.name,
                privateConversationId: data.private_conversation_id,
                room: data.room,
                startedAt: data.started_at,
                status: data.status,
            });
            setOpenCallDialog(true);
        };

        const handleCallEnded = (data: SocketPrivateCallEndedPayload) => {
            clearActivePrivateCall();
            setOpenCallDialog(false);

            if (data.ended_by !== user.id) {
                toast.info('The call has ended.');
            }
        };
        const handlePrivateCallError = (data: SocketErrorPayload) => {
            toast.error(data.message);
        };
        const handlePrivateCallStarted = (data: SocketPrivateCallPayload) => {
            handleCallStarted(data, false);
        };
        const handlePrivateCallIncoming = (data: SocketPrivateCallPayload) => {
            handleCallStarted(data, true);
        };
        const handleCallAnswered = (data: SocketPrivateCallAnsweredPayload) => {
            const { activePrivateCall } = usePrivateCallStore.getState();

            if (!activePrivateCall) return;
            if (activePrivateCall.callId !== data.call_id) return;
            if (
                activePrivateCall.privateConversationId !==
                data.private_conversation_id
            ) {
                return;
            }

            setActivePrivateCall({
                ...activePrivateCall,
                room: data.room,
                status: data.status,
            });
        };

        socket.on('private-call:start:error', handlePrivateCallError);
        socket.on('private-call:end:error', handlePrivateCallError);
        socket.on('private-call:started', handlePrivateCallStarted);
        socket.on('private-call:incoming', handlePrivateCallIncoming);
        socket.on('private-call:answered', handleCallAnswered);
        socket.on('private-call:ended', handleCallEnded);
        socket.on('private-call:answer:error', handlePrivateCallError);

        return () => {
            socket.off('private-call:start:error', handlePrivateCallError);
            socket.off('private-call:end:error', handlePrivateCallError);
            socket.off('private-call:started', handlePrivateCallStarted);
            socket.off('private-call:incoming', handlePrivateCallIncoming);
            socket.off('private-call:answered', handleCallAnswered);
            socket.off('private-call:ended', handleCallEnded);
            socket.off('private-call:answer:error', handlePrivateCallError);
        };
    }, [
        clearActivePrivateCall,
        privateConversationMap,
        setActivePrivateCall,
        setOpenCallDialog,
        user?.id,
    ]);
};
