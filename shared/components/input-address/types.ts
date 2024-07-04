import { Input } from '@lidofinance/lido-ui';
import { ComponentProps } from 'react';

export type InputAddressProps = {
  value?: string;
  onChange?: (value: string) => void;
  showCopyBtn?: boolean;
} & Omit<ComponentProps<typeof Input>, 'onChange' | 'value'>;
