import { IconLoader2 } from '@tabler/icons-react';
import type { FC } from 'react';

import { cn } from '@/lib/utils';

interface LoaderFallbackProps {
    containerClassName?: string;
    label: string;
    loaderSize?: number;
}

export const LoaderFallback: FC<LoaderFallbackProps> = ({
    containerClassName,
    label,
    loaderSize
}) => (
    <div className={cn(
        'h-full flex items-center justify-center',
        containerClassName
    )}>
        <div className='flex flex-col items-center gap-y-4'>
            <IconLoader2 className='animate-spin text-muted-foreground' size={loaderSize ?? 24} />
            <p className='text-muted-foreground text-center text-sm'>{label}</p>
        </div>
    </div>
);