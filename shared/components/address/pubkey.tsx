import {
  Address as AddressComponent,
  TypographyColor,
} from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import { Tooltip } from '../tooltip/tooltip';
import { PubkeyContainerStyle } from './styles';

export type PubkeyProps = {
  link?: ReactNode;
  pubkey: string | undefined;
  monospace?: boolean;
  symbols?: number;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
  color?: TypographyColor;
};

export const Pubkey: FC<PubkeyProps> = ({
  pubkey = '',
  symbols = 8,
  link,
  color,
  monospace = true,
}) => {
  const component = (
    <AddressComponent
      address={pubkey}
      symbols={!symbols ? 90 : symbols}
      tooltip={false}
    />
  );
  return (
    <>
      {pubkey && (
        <PubkeyContainerStyle $color={color} $monospace={monospace}>
          {symbols === 0 ? (
            component
          ) : (
            <Tooltip position="top" content={pubkey} width={300}>
              {component}
            </Tooltip>
          )}
          {link}
        </PubkeyContainerStyle>
      )}
    </>
  );
};
