import { Address, LightThemeProvider, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Warning } from 'shared/components';
import { RoleBlockProposed } from './styles';

type Props = { address?: string };

export const ProposedAddress: FC<Props> = ({ address }) => {
  if (!address) return null;

  return (
    <RoleBlockProposed>
      <Warning text="Pending change:" />
      <LightThemeProvider>
        <Text size="xxs">
          <Address as="span" address={address} symbols={6} />
        </Text>
      </LightThemeProvider>
    </RoleBlockProposed>
  );
};
