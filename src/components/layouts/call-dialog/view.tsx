import { IconPhone, IconPhoneOff } from '@tabler/icons-react';
import { type FC, memo } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import type { CallDialogViewProps } from './types';

const CallDialogView: FC<CallDialogViewProps> = ({
    activePrivateCall,
    handleAnswerCall,
    handleEndCall,
    onOpenChange,
    openCallDialog,
}) => {
    const isIncomingRinging =
        activePrivateCall?.isIncoming && activePrivateCall.status === 'ringing';
    const callStatusText =
        isIncomingRinging
            ? 'Incoming'
            : activePrivateCall?.status ?? 'Calling';

    return (
        <Dialog onOpenChange={onOpenChange} open={openCallDialog}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="sr-only">Call Dialog</DialogTitle>
                    <DialogDescription className="sr-only">
                        This is the call dialog content.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-y-6">
                    <Avatar className="size-14 ring-1 ring-white/70">
                        <AvatarFallback className='text-lg font-semibold'>
                            {activePrivateCall?.peerInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-center gap-y-2">
                        <p className="font-medium capitalize">
                            {activePrivateCall?.peerName}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                            {activePrivateCall
                                ? `${activePrivateCall.callType} call - ${callStatusText}`
                                : 'Calling...'}
                        </p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        {isIncomingRinging && (
                            <Button
                                onClick={handleAnswerCall}
                                size="icon"
                                variant="default"
                            >
                                <IconPhone />
                            </Button>
                        )}
                        <Button
                            onClick={handleEndCall}
                            size="icon"
                            variant="destructive"
                        >
                            <IconPhoneOff />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default memo(CallDialogView);
