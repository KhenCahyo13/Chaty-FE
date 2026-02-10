import { cn } from '@/lib/utils';
import type { FC } from 'react';

interface ImageTextFallbackProps {
    containerClassName?: string;
    imageClassName?: string;
    imageName: string;
    label: string;
}

export const ImageTextFallback: FC<ImageTextFallbackProps> = ({
    containerClassName,
    imageClassName,
    imageName,
    label
}) => (
    <div className={cn(
        'h-full flex items-center justify-center',
        containerClassName
    )}>
        <div className='flex flex-col items-center gap-y-4'>
            <img
                src={`/assets/illustrations/${imageName}.svg`}
                alt="Fallback"
                className={cn(
                    'w-56',
                    imageClassName
                )}
            />
            <p className='text-muted-foreground text-center'>{label}</p>
        </div>
    </div>
);