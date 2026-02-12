import type { ReactNode } from 'react';

export interface LayoutProps {
    children?: ReactNode;
    className?: string;
}

export interface FormFileFieldState {
    name: string;
    state: {
        meta: {
            isTouched: boolean;
            isValid: boolean;
            errors: Array<{ message?: string } | undefined>;
        };
    };
    handleBlur: () => void;
    handleChange: (value: File | undefined) => void;
}
