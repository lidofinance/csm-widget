import { Card, Stack, downQuery } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

const BodyStyled = styled(Stack)<{ $compactOnMobile?: boolean }>`
  padding: 24px;

  ${({ $compactOnMobile }) =>
    $compactOnMobile &&
    `
    @media ${downQuery('sm')} {
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
  <Card
    align="stretch"
    padding={0}
    gap={0}
    clip
    dataTestId={{ root: dataTestId }}
  >
    {header}
    <BodyStyled gap={24} $compactOnMobile={compactOnMobile}>
      {children}
      {actions}
    </BodyStyled>
  </Card>
);
