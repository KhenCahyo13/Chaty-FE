import { IconMicrophone, IconPlus, IconSend2 } from '@tabler/icons-react';
import { memo, type FC } from 'react';

import { Button } from '@/components/ui/button';
import type { ChatBoxProps } from '../types';
import { TfTextInput } from '@/components/tanstack-form/text-input';

const ChatBox: FC<ChatBoxProps> = ({
    form,
    isCreateMessageLoading
}) => (
    <div className="bg-sidebar border-t shrink-0">
        <form
            className="flex items-center gap-x-4 px-4 py-4"
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <Button type='button' variant='ghost' size='icon'>
                <IconPlus className="size-6 text-muted-foreground" />
            </Button>
            <div className="flex flex-1">
                <TfTextInput
                    form={form}
                    placeholder='Write a message'
                    name='content'
                    disabled={isCreateMessageLoading}
                />
            </div>
            <Button type='submit' size='icon' disabled={isCreateMessageLoading}>
                <IconSend2 />
            </Button>
            <Button type='button' variant='ghost' size='icon'>
                <IconMicrophone className="size-6 text-muted-foreground" />
            </Button>
        </form>
    </div>
);

export default memo(ChatBox);