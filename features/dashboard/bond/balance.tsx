import { InlineLoader, Text } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { StackStyle } from 'shared/components/stack/style';
import { FormatPrice, FormatToken } from 'shared/formatters';
import { useEthUsd } from 'shared/hooks';
import styled from 'styled-components';

type Props = {
  title?: string;
  amount?: BigNumber;
  token?: TOKENS;
  loading?: boolean;
  big?: boolean;
};

export const Balance: FC<Props> = ({ title, amount, token, loading, big }) => {
  const { usdAmount } = useEthUsd(amount);

  return (
    <BalanceStyle $big={big}>
      {title && <BalanceTitle>{title}</BalanceTitle>}
      {loading ? (
        <InlineLoader />
      ) : (
        <BalanceValue>
          <FormatToken amount={amount} token={token ?? TOKENS.STETH} />
          <Text size={'xxs'} color={'secondary'}>
            <FormatPrice amount={usdAmount} />
          </Text>
        </BalanceValue>
      )}
    </BalanceStyle>
  );
};

const BalanceStyle = styled(StackStyle).attrs({ $direction: 'column' })<{
  $big?: boolean;
}>`
  gap: 2px;
  align-items: ${({ $big }) => ($big ? 'flex-end' : 'flex-start')};
  min-width: 120px;

  font-size: ${({ theme, $big }) =>
    $big ? theme.fontSizesMap.sm : theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 700;
`;

const BalanceValue = styled(StackStyle).attrs({ $direction: 'column' })`
  gap: 0;
`;

const BalanceTitle = styled.h5`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 400;
`;
