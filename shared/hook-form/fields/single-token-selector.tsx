import {
  isTokenIcon,
  TokenIcon,
  TokenSelector,
} from '@lidofinance/lido-app-ui';
import { FC } from 'react';

export type SingleTokenSelectorProps = { token: string };

export const SingleTokenSelector: FC<SingleTokenSelectorProps> = ({
  token,
}) => (
  <TokenSelector
    single
    value={token}
    options={[
      {
        value: token,
        label: token,
        icon: isTokenIcon(token) ? <TokenIcon token={token} /> : undefined,
      },
    ]}
  />
);
