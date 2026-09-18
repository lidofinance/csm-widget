import { ButtonIcon, Input, LockSmall } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { InputAddress, InputPercent } from 'shared/components';
import styled from 'styled-components';
import { Address } from 'viem';
import { AddressColumn, RowStyle, ShareColumn } from './styles';

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
    <RowStyle>
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
    </RowStyle>
  );
};

type BondRowProps = {
  title: string;
  description: string;
  share: bigint;
};

export const BondRowView: FC<BondRowProps> = ({
  title,
  description,
  share,
}) => {
  return (
    <RowStyle data-testid="splitsBondRow">
      <AddressColumn>
        <InputStyled disabled label={title} value={description} fullwidth />
      </AddressColumn>
      <ShareColumn>
        <InputPercent disabled label="Share, %" value={share} fullwidth />
      </ShareColumn>
    </RowStyle>
  );
};

const InputStyled = styled(Input)`
  & span span {
    transform: translateY(-10px);
    font-weight: 700;
    color: var(--lido-color-text);
  }
  & input {
    font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
    line-height: 1.668;
    top: 11px;
  }
`;
