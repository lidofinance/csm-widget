import { Divider } from '@lidofinance/lido-ui';
import { Grid } from 'shared/components';
import styled from 'styled-components';

export const RolesGrid = styled(Grid)`
  grid-template-columns: 1fr 1fr;

  ${({ theme }) => theme.mediaQueries.lg} {
    grid-template-columns: 1fr;
  }
`;

export const RoleRowStyle = styled.div`
  display: grid;
  grid-template-columns: subgrid;
  grid-column: 1 / -1;
  align-items: start;
  gap: inherit;
`;

export const DividerStyle = styled(Divider)`
  grid-column: 1 / -1;
`;
