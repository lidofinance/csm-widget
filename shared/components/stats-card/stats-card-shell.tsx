import { Card, Stack } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

const CardStyled = styled(Card)`
  && {
    padding: 0;
    overflow: hidden;
    align-items: stretch;
    gap: 0;
  }
`;

const BodyStyled = styled(Stack)<{ $compactOnMobile?: boolean }>`
  padding: 24px;

  ${({ $compactOnMobile }) =>
    $compactOnMobile &&
    `
    @media (max-width: 599px) {
      padding: 20px;
    }
  `}
`;

type StatsCardShellProps = {
  header?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  dataTestId?: string;
  compactOnMobile?: boolean;
};

export const StatsCardShell: FC<StatsCardShellProps> = ({
  header,
  actions,
  children,
  dataTestId,
  compactOnMobile,
}) => (
  <CardStyled dataTestId={{ root: dataTestId }}>
    {header}
    <BodyStyled gap={24} $compactOnMobile={compactOnMobile}>
      {children}
      {actions}
    </BodyStyled>
  </CardStyled>
);
