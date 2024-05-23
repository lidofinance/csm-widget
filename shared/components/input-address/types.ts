import { Input } from '@lidofinance/lido-ui';
import { ComponentProps } from 'react';

export type InputAddressProps = {
  address?: string;
  isAddressResolving?: boolean;
  showCopyBtn?: boolean;
} & Omit<ComponentProps<typeof Input>, 'onChange' | 'value'>;
