import { FeeSplit } from '@lidofinance/lido-csm-sdk';
import { Button, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC, useCallback } from 'react';
import { Address } from 'shared/components';
import { useNavigate } from 'shared/navigate';
import {
  RoleAddressColumn,
  RoleNameColumn,
  RoleRowStyle,
  SplitShare,
  SplitterAddressRow,
} from './styles';

type SplitterRowProps = {
  feeSplits?: FeeSplit[];
  setupPath?: PATH;
};

const formatShare = (share: bigint) => {
  const percent = Number(share) / 100;
  return `${percent}%`;
};

export const SplitterRow: FC<SplitterRowProps> = ({ feeSplits, setupPath }) => {
  const navigate = useNavigate();
  const onSetup = useCallback(
    () => setupPath && navigate(setupPath),
    [navigate, setupPath],
  );

  return (
    <RoleRowStyle>
      <RoleNameColumn>
        <Text size="xs" weight={700}>
          Rewards splitter
        </Text>
      </RoleNameColumn>

      <RoleAddressColumn>
        {feeSplits?.map((split) => (
          <SplitterAddressRow key={split.recipient}>
            <Address address={split.recipient} showIcon />
            <SplitShare>{formatShare(split.share)}</SplitShare>
          </SplitterAddressRow>
        ))}
      </RoleAddressColumn>

      {setupPath && !feeSplits?.length && (
        <Button size="xs" variant="outlined" onClick={onSetup}>
          Set up
        </Button>
      )}
    </RoleRowStyle>
  );
};
