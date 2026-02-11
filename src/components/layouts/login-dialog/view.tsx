import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { FC } from 'react';
import type { LoginDialogViewProps } from './types';
import { FieldGroup } from '@/components/ui/field';
import { TfTextInput } from '@/components/tanstack-form/text-input';
import { Separator } from '@/components/ui/separator';
import { TfSubmitButton } from '@/components/tanstack-form/button';

const LoginDialogView: FC<LoginDialogViewProps> = ({
    form,
    token,
    isLoginLoading
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
                        required
                        form={form}
                        label='Username'
                        placeholder='Username'
                        name='username'
                    />
                    <TfTextInput
                        required
                        type='password'
                        form={form}
                        label='Password'
                        placeholder='Password'
                        name='password'
                    />
                    <TfSubmitButton isLoading={isLoginLoading}>Sign In</TfSubmitButton>
                </FieldGroup>
            </form>
        </DialogContent>
    </Dialog>
);

export default LoginDialogView;