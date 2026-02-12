import type { FC } from 'react';

import { TfSubmitButton } from '@/components/tanstack-form/button';
import { TfTextInput } from '@/components/tanstack-form/text-input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';

import type { LoginDialogViewProps } from './types';

const LoginDialogView: FC<LoginDialogViewProps> = ({
    form,
    isLoginLoading,
    token
}) => (
    <Dialog open={!token}>
        <DialogContent showCloseButton={false}>
            <DialogHeader>
                <DialogTitle>Chaty Sign In</DialogTitle>
                <DialogDescription className="text-muted-foreground">Login first to continue using this app.</DialogDescription>
            </DialogHeader>
            <Separator className='mb-2' />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit()
                }}
            >
                <FieldGroup>
                    <TfTextInput
                        form={form}
                        label='Username'
                        name='username'
                        placeholder='Username'
                        required
                    />
                    <TfTextInput
                        form={form}
                        label='Password'
                        name='password'
                        placeholder='Password'
                        required
                        type='password'
                    />
                    <TfSubmitButton isLoading={isLoginLoading}>Sign In</TfSubmitButton>
                </FieldGroup>
            </form>
        </DialogContent>
    </Dialog>
);

export default LoginDialogView;