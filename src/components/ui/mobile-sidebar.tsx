'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useSidebar } from '@/hooks/useSidebar';
import { SIDEBAR_WIDTH_MOBILE } from '@/components/ui/sidebar.constants';
import { cn } from '@/lib/utils';

function MobileSidebar({
  side = 'left',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right';
}) {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
      <SheetContent
        data-sidebar="sidebar"
        data-slot="sidebar"
        data-mobile="true"
        className={cn("bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden", className)}
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
          } as React.CSSProperties
        }
        side={side}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>Displays the mobile sidebar.</SheetDescription>
        </SheetHeader>
        <div className="flex h-full w-full flex-col">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

export { MobileSidebar };
