import { IconMicrophone, IconPlus, IconSend2 } from '@tabler/icons-react';
import { type FC,memo } from 'react';

import { TfTextInput } from '@/components/tanstack-form/text-input';
import { Button } from '@/components/ui/button';

import type { ChatBoxProps } from '../types';

const ChatBox: FC<ChatBoxProps> = ({
    form,
    isCreateMessageLoading
}) => (
    <div className="relative z-20 shrink-0 border-t border-border/70 bg-background/85 backdrop-blur">
        <form
            className="mx-auto flex max-w-5xl items-center gap-x-1.5 py-2 md:gap-x-2"
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className="rounded-lg border border-transparent hover:border-border/70 hover:bg-white dark:hover:bg-muted/50"
            >
                <IconPlus className="size-5 text-muted-foreground" />
            </Button>
            <div className="flex flex-1 rounded-xl border border-border/70 bg-white px-1 shadow-[0_20px_26px_-30px_oklch(0.28_0.04_250)] dark:bg-muted/40 dark:shadow-none">
                <TfTextInput
                    form={form}
                    placeholder='Write a message'
                    name='content'
                    disabled={isCreateMessageLoading}
                    className="h-9 border-none bg-transparent text-[13px] shadow-none focus-visible:ring-0"
                />
            </div>
            <Button
                type='submit'
                size='icon-sm'
                className="rounded-lg"
                disabled={isCreateMessageLoading}
            >
                <IconSend2 className="size-4" />
            </Button>
            <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className="rounded-lg border border-transparent hover:border-border/70 hover:bg-white dark:hover:bg-muted/50"
            >
                <IconMicrophone className="size-5 text-muted-foreground" />
            </Button>
        </form>
    </div>
);

export default memo(ChatBox);
