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

const BodyStyled = styled(Stack)`
  padding: 24px;
`;

type StatsCardShellProps = {
  header?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  dataTestId?: string;
};

export const StatsCardShell: FC<StatsCardShellProps> = ({
  header,
  actions,
  children,
  dataTestId,
}) => (
  <CardStyled dataTestId={{ root: dataTestId }}>
    {header}
    <BodyStyled gap={24}>
      {children}
      {actions}
    </BodyStyled>
  </CardStyled>
);
