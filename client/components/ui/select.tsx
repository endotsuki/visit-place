import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/utils';
import { ArrowDown01Icon, ArrowUp01Icon, Tick02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

// ── Shared glass style ──────────────────────────────────────────────
const glassBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.10)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.15), 0 2px 12px rgba(0,0,0,0.25)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
};

// ── Trigger ─────────────────────────────────────────────────────────
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'group relative flex h-10 w-full cursor-pointer items-center justify-between overflow-hidden rounded-2xl px-4 py-2 text-sm text-white/70 outline-none transition-all duration-200',
      'disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      'data-[state=open]:border-white/40 data-[placeholder]:text-white/30',
      className
    )}
    style={glassBase}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)';
      (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.16)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.background = glassBase.background as string;
      (e.currentTarget as HTMLElement).style.border = glassBase.border as string;
    }}
    {...props}
  >
    {/* Top shimmer */}
    <span
      aria-hidden
      className='pointer-events-none absolute inset-x-3 top-0 h-px opacity-50'
      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
    />
    {children}
    <SelectPrimitive.Icon asChild>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        size={20}
        className='ml-2 shrink-0 text-white/30 transition-transform duration-200 group-data-[state=open]:rotate-180'
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// ── Scroll buttons ───────────────────────────────────────────────────
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1.5 text-white/30', className)}
    {...props}
  >
    <HugeiconsIcon icon={ArrowUp01Icon} className='h-3.5 w-3.5' />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1.5 text-white/30', className)}
    {...props}
  >
    <HugeiconsIcon icon={ArrowDown01Icon} className='h-3.5 w-3.5' />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

// ── Content (dropdown) ───────────────────────────────────────────────
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        'relative z-50 max-h-80 min-w-[8rem] overflow-hidden rounded-2xl text-white/80',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
        className
      )}
      style={{
        background: 'rgba(20,20,25,0.75)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
      }}
      {...props}
    >
      {/* Top shimmer */}
      <span
        aria-hidden
        className='pointer-events-none absolute inset-x-4 top-0 h-px opacity-40'
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
      />
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1.5',
          position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

// ── Label ────────────────────────────────────────────────────────────
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-xs font-semibold uppercase tracking-wider text-white/30', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

// ── Item ─────────────────────────────────────────────────────────────
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-xl py-2 pl-8 pr-3 text-sm text-white/65 outline-none transition-all duration-150',
      'focus:bg-white/10 focus:text-white focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
      'data-[highlighted]:bg-white/10 data-[state=checked]:text-accent',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
      className
    )}
    style={{ '--tw-bg-opacity': '1' } as React.CSSProperties}
    {...props}
  >
    <span className='absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center'>
      <SelectPrimitive.ItemIndicator>
        <HugeiconsIcon icon={Tick02Icon} size={15} className='text-accent' />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

// ── Separator ────────────────────────────────────────────────────────
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px', className)}
    style={{ background: 'rgba(255,255,255,0.07)' }}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
