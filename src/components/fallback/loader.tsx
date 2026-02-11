import { cn } from '@/lib/utils';
import { IconLoader2 } from '@tabler/icons-react';
import type { FC } from 'react';

interface LoaderFallbackProps {
    containerClassName?: string;
    loaderSize?: number;
    label: string;
}

export const LoaderFallback: FC<LoaderFallbackProps> = ({
    containerClassName,
    loaderSize,
    label
}) => (
    <div className={cn(
        'h-full flex items-center justify-center',
        containerClassName
    )}>
        <div className='flex flex-col items-center gap-y-4'>
            <IconLoader2 size={loaderSize ?? 24} className='animate-spin text-muted-foreground' />
            <p className='text-muted-foreground text-center text-sm'>{label}</p>
        </div>
    </div>
);