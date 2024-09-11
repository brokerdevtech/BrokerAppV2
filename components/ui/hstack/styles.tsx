import {isWeb} from '@gluestack-ui/nativewind-utils/IsWeb';
import {tva} from '@gluestack-ui/nativewind-utils/tva';

const baseStyle = isWeb
  ? 'flex relative z-0 box-border border-0 list-none min-w-0 min-h-0 bg-transparent items-stretch m-0 p-0 text-decoration-none'
  : '';

export const hstackStyle = tva({
  base: `flex-row ${baseStyle}`,
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
      true: 'flex-row-reverse',
    },
    cls: {
    
      lg: 'h-8 bg-primary-300', // Large size variant with background color
   
    },
    mb: {
      xs: 'mb-1',
      sm: 'mb-2',
      md: 'mb-3',
      lg: 'mb-4',
      xl: 'mb-5',
      '2xl': 'mb-6',
      '3xl': 'mb-7',
      '4xl': 'mb-8',
    },
  },
});
