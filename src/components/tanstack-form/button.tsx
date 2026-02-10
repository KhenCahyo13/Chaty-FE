import { type FC, type ReactNode } from 'react';
import { Button } from '../ui/button';
import { IconLoader } from '@tabler/icons-react';
import { Field } from '../ui/field';

interface TfSubmitButtonProps {
    isLoading: boolean;
    children: ReactNode;
}

export const TfSubmitButton: FC<TfSubmitButtonProps> = ({
    isLoading,
    children,
}) => {
    return (
        <Field>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <IconLoader className="animate-spin" /> : children}
            </Button>
        </Field>
    );
};