import { IconMoonStars, IconSettings, IconUserCircle } from '@tabler/icons-react';
import { type FC,memo } from 'react';

import { Button } from '@/components/ui/button';

import type { SideButtonsViewProps } from './types';

const SideButtonsView: FC<SideButtonsViewProps> = ({
    isDarkTheme,
    handleToggleTheme
}) => (
    <aside className="hidden w-14 shrink-0 flex-col justify-end border-r border-sidebar-border/70 px-1.5 py-3 md:flex">
        <div className="flex flex-col items-center gap-y-2">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10 rounded-xl border border-sidebar-border/70 bg-background/80 hover:bg-background"
                aria-label="Profile"
            >
                <IconUserCircle className="size-5 text-muted-foreground" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10 rounded-xl border border-transparent hover:border-sidebar-border/80 hover:bg-background/80"
                aria-label="Settings"
            >
                <IconSettings className="size-5 text-muted-foreground" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10 rounded-xl border border-transparent hover:border-sidebar-border/80 hover:bg-background/80"
                aria-label="Theme"
                aria-pressed={isDarkTheme}
                onClick={handleToggleTheme}
            >
                <IconMoonStars className="size-5 text-muted-foreground" />
            </Button>
        </div>
    </aside>
);

export default memo(SideButtonsView);
