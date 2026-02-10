import { ButtonIcon, LockSmall } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { InputAddress, InputPercent, Stack } from 'shared/components';
import styled from 'styled-components';
import { Address } from 'viem';

const AddressColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

const ShareColumn = styled.div`
  width: 90px;
  flex-shrink: 0;
`;

type SplitRowProps = {
  title: string;
  address: Address;
  share: bigint;
  locked?: boolean;
};

export const SplitRowView: FC<SplitRowProps> = ({
  title,
  address,
  share,
  locked,
}) => {
  return (
    <Stack direction="row" gap="sm">
      <AddressColumn>
        <InputAddress disabled simple label={title} value={address} fullwidth />
      </AddressColumn>
      <ShareColumn>
        <InputPercent disabled label="Share, %" value={share} fullwidth />
      </ShareColumn>
      {locked && (
        <ButtonIcon
          color="secondary"
          disabled
          icon={<LockSmall />}
          variant="text"
          size="xs"
        />
      )}
    </Stack>
  );
};
