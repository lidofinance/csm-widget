import { Skeleton, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import styled from 'styled-components';
import { ChipsAreaStyled, TableCardStyled } from './styles';

const RowStyled = styled(Stack)`
  padding: 20px 32px;

  @media (max-width: 599px) {
    padding: 20px 16px;
  }
`;

const CHIP_WIDTHS = [90, 110, 130];
const ROWS = [0, 1, 2, 3];

export const KeysSkeleton: FC = () => (
  <TableCardStyled dataTestId={{ root: 'viewKeysBlock' }}>
    <div data-testid="loader">
      <ChipsAreaStyled direction="row" gap={8}>
        {CHIP_WIDTHS.map((width) => (
          <Skeleton key={width} variant="block" style={{ width, height: 32 }} />
        ))}
      </ChipsAreaStyled>
      <RowStyled direction="column" gap={20}>
        <Skeleton variant="text" style={{ width: 120 }} />
        {ROWS.map((row) => (
          <Skeleton key={row} variant="text" />
        ))}
      </RowStyled>
    </div>
  </TableCardStyled>
);
