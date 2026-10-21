import {cva} from 'class-variance-authority';
import {controlHeight} from '@/lib/glaze/utils';

export const buttonVariants = cva(
  [
    'group/button relative inline-flex max-w-full shrink-0 items-center justify-center gap-1.5 rounded-pill whitespace-nowrap select-none',
    'disabled:cursor-not-allowed data-disabled:cursor-not-allowed aria-busy:cursor-progress',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: 'glass glass-ink',
        destructive: 'glass glass-coral',
        confirm: 'glass glass-green',
        secondary: 'flat',
        // Plain: no glass. A wash under the pointer and while held, the same press scale as the glass.
        ghost: [
          'bg-transparent text-text-1 transition-[background-color,color,scale] duration-(--dur-press) ease-out',
          'hover:not-data-disabled:bg-hover active:not-data-disabled:bg-pressed active:not-data-disabled:scale-(--scale-press) data-popup-open:bg-pressed',
          'data-disabled:not-aria-busy:text-text-disabled',
          'forced-colors:border forced-colors:border-solid forced-colors:border-[ButtonText]',
        ],
      },
      size: {
        sm: `${controlHeight.sm} px-2.5 type-label-sm [&_svg]:size-(--icon-sm)`,
        default: `${controlHeight.default} px-3 type-label [&_svg]:size-(--icon)`,
        lg: `${controlHeight.lg} px-3.5 type-label-lg [&_svg]:size-(--icon-lg)`,
        'icon-sm': 'size-(--control-sm) px-0 [&_svg]:size-(--icon-sm)',
        icon: 'size-(--control) px-0 [&_svg]:size-(--icon)',
        'icon-lg': 'size-(--control-lg) px-0 [&_svg]:size-(--icon-lg)',
      },
    },
    defaultVariants: {variant: 'primary', size: 'default'},
  },
);
