import { Input } from '@lidofinance/lido-ui';
import { ComponentProps } from 'react';

export type InputAddressProps = {
  value?: string;
  onChange?: (value: string) => void;
  address?: string;
  isAddressResolving?: boolean;
  showCopyBtn?: boolean;
  revoke?: boolean;
} & Omit<ComponentProps<typeof Input>, 'onChange' | 'value'>;
