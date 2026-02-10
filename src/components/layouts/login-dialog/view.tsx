import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { FC } from 'react';
import type { LoginDialogViewProps } from './types';

const LoginDialogView: FC<LoginDialogViewProps> = ({
    token
}) => (
    <Dialog open={!token}>
        <DialogContent showCloseButton={false}>
            <DialogHeader>
                <DialogTitle>Chaty Sign In</DialogTitle>
                <DialogDescription className="text-muted-foreground">Login first to continue using this app.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center mt-6">

            </div>
        </DialogContent>
    </Dialog>
);

export default LoginDialogView;