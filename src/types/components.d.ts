import type { ReactNode } from 'react';

export interface LayoutProps {
    children?: ReactNode;
    className?: string;
}

export interface FormFileFieldState {
    handleBlur: () => void;
    handleChange: (value: File | undefined) => void;
    name: string;
    state: {
        meta: {
            errors: Array<undefined | { message?: string }>;
            isTouched: boolean;
            isValid: boolean;
        };
    };
}
