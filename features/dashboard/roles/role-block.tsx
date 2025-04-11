import { FC } from 'react';
import { Address, Stack } from 'shared/components';
import { ProposedAddress } from './proposed-address';
import { Chip, RoleBlockWrapper, RoleTitle } from './styles';
import { Text } from '@lidofinance/lido-ui';

type RoleBlockProps = {
  title: string;
  address: string;
  proposedAddress?: string;
  isYou?: boolean;
};

export const RoleBlock: FC<RoleBlockProps> = ({
  title,
  isYou,
  address,
  proposedAddress,
}) => {
  return (
    <RoleBlockWrapper>
      <Stack gap="sm">
        <RoleTitle>{title}</RoleTitle>
        {isYou && <Chip>You</Chip>}
      </Stack>
      <Text size="sm">
        <Address address={address} showIcon bold />
      </Text>
      <ProposedAddress address={proposedAddress} />
    </RoleBlockWrapper>
  );
};
