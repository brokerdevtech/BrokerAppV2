import {isWeb} from '@gluestack-ui/nativewind-utils/IsWeb';
import {tva} from '@gluestack-ui/nativewind-utils/tva';

const baseStyle = isWeb
  ? 'flex flex-col relative z-0 box-border border-0 list-none min-w-0 min-h-0 bg-transparent items-stretch m-0 p-0 text-decoration-none'
  : '';

export const vstackStyle = tva({
  base: `flex-col ${baseStyle}`,
  variants: {
    space: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-5',
      '2xl': 'gap-6',
      '3xl': 'gap-7',
      '4xl': 'gap-8',
    },
    reversed: {
      true: 'flex-col-reverse',
    },
    ph: {
      xs: 'px-2',
      sm: 'px-3',
      md: 'px-4',
      lg: 'px-5',
      xl: 'px-6',
      '2xl': 'px-8',
    },
    w: {
      xs: 'w-full',
      sm: 'w-full',
      md: 'w-[240px]',
      lg: 'w-[320px]',
      xl: 'w-[400px]',
      '2xl': 'w-[480px]',
      '3xl': 'w-[560px]',
      '4xl': 'w-[640px]',
    },
  },
});
