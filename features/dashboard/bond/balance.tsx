import { InlineLoader } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

type Props = {
  title?: string;
  loading?: boolean;
  big?: boolean;
};

export const Balance: FC<PropsWithChildren<Props>> = ({
  title,
  loading,
  big,
  children,
}) => {
  return (
    <BalanceStyle $big={big}>
      {title && <BalanceTitle>{title}</BalanceTitle>}
      {loading ? <InlineLoader /> : <>{children}</>}
    </BalanceStyle>
  );
};

const BalanceStyle = styled(StackStyle).attrs({ $direction: 'column' })<{
  $big?: boolean;
}>`
  gap: ${({ $big }) => ($big ? 0 : 2)}px;
  align-items: ${({ $big }) => ($big ? 'flex-end' : 'flex-start')};
  align-self: stretch;

  font-size: ${({ theme, $big }) =>
    $big ? theme.fontSizesMap.sm : theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 700;
`;

const BalanceTitle = styled.h5`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 400;
`;
