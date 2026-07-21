import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Address } from 'shared/components/address';
import styled from 'styled-components';

const BoxStyle = styled.div`
  border: 1px solid var(--lido-color-border);
  border-radius: 10px;
  padding: 6px 16px;
  background: var(--lido-color-accentControlBg);
`;

type LabeledAddressBoxProps = {
  label: string;
  address: string;
};

export const LabeledAddressBox: FC<LabeledAddressBoxProps> = ({
  label,
  address,
}) => (
  <BoxStyle data-testid="labeledAddressBox">
    <Text size="xxs" color="secondary" as="div">
      {label}
    </Text>
    <Address address={address} showIcon={false} link={false} symbols={90} />
  </BoxStyle>
);
