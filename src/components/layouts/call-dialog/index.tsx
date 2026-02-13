import { useCallback } from 'react';

import { socket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth-store';
import { useComponentsStore } from '@/stores/components';
import { usePrivateCallStore } from '@/stores/private-call-store';

import CallDialogView from './view';

const CallDialog = () => {
    const { user } = useAuthStore();
    const { openCallDialog, setOpenCallDialog } = useComponentsStore();
    const { activePrivateCall, clearActivePrivateCall, setActivePrivateCall } =
        usePrivateCallStore();

    const handleAnswerCall = useCallback(() => {
        if (!activePrivateCall) return;

        socket.emit('private-call:answer', {
            call_id: activePrivateCall.callId,
            private_conversation_id: activePrivateCall.privateConversationId,
        });

        setActivePrivateCall({
            ...activePrivateCall,
            status: 'answered',
        });
    }, [activePrivateCall, setActivePrivateCall]);

    const handleEndCall = useCallback(() => {
        if (!activePrivateCall) return;

        const status =
            activePrivateCall.callerId === user?.id ? 'cancelled' : 'rejected';

        socket.emit('private-call:end', {
            call_id: activePrivateCall.callId,
            private_conversation_id: activePrivateCall.privateConversationId,
            status,
        });

        setOpenCallDialog(false);
        clearActivePrivateCall();
    }, [activePrivateCall, clearActivePrivateCall, setOpenCallDialog, user?.id]);

    const handleOpenChange = useCallback(
        (open: boolean) => {
            if (open) {
                setOpenCallDialog(true);
                return;
            }

            if (activePrivateCall) {
                handleEndCall();
                return;
            }

            setOpenCallDialog(false);
        },
        [activePrivateCall, handleEndCall, setOpenCallDialog]
    );

    return (
        <CallDialogView
            activePrivateCall={activePrivateCall}
            handleAnswerCall={handleAnswerCall}
            handleEndCall={handleEndCall}
            onOpenChange={handleOpenChange}
            openCallDialog={openCallDialog}
        />
    );
};

export default CallDialog;
