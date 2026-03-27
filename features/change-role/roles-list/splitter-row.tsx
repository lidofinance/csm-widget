import { FeeSplit } from '@lidofinance/lido-csm-sdk';
import { Button, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { Address } from 'shared/components';
import { LocalLink } from 'shared/navigate';
import {
  RoleAddressColumn,
  RoleNameColumn,
  RoleRowStyle,
  SplitShare,
  SplitterAddressRow,
} from './styles';

type SplitterRowProps = {
  feeSplits?: FeeSplit[];
  path: PATH;
  canEdit?: boolean;
};

const formatShare = (share: bigint) => {
  const percent = Number(share) / 100;
  return `${percent}%`;
};

export const SplitterRow: FC<SplitterRowProps> = ({
  feeSplits,
  path,
  canEdit,
}) => {
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

      <LocalLink href={path}>
        <Button size="xs" variant="outlined">
          {!canEdit ? 'View' : feeSplits?.length ? 'Edit' : 'Set up'}
        </Button>
      </LocalLink>
    </RoleRowStyle>
  );
};
