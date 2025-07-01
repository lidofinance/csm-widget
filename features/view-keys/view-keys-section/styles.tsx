import { Block, Button } from '@lidofinance/lido-ui';
import styled from 'styled-components';
import { MEDIA_QUERY_XXL } from 'styles/constants';

export const ViewKeysBlock = styled(Block)`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  flex-direction: column;
`;

export const TableStyle = styled.table`
  margin: -${({ theme }) => theme.spaceMap.xxl}px;
  border-collapse: collapse;

  ${({ theme }) => theme.mediaQueries.md} {
    margin: -${({ theme }) => theme.spaceMap.lg}px;
  }

  th {
    text-align: left;
    color: var(--lido-color-text);
  }

  tr {
    display: grid;
    grid-template-columns: 5fr 3fr 1fr 3fr;
    grid-auto-rows: auto;
    grid-column-gap: 1rem;
    align-items: center;
    gap: 12px 32px;

    padding: 12px 32px;

    ${MEDIA_QUERY_XXL} {
      grid-template-columns: 5fr 4fr 1fr;

      td:nth-child(4) {
        grid-column: 1 / -1;

        &:empty {
          display: none;
        }
      }

      th:nth-child(4) {
        display: none;
      }
    }

    ${({ theme }) => theme.mediaQueries.md} {
      grid-template-columns: 1fr;

      padding: 20px 32px;
    }
  }

  thead tr {
    padding: 24px 32px 16px;

    ${({ theme }) => theme.mediaQueries.md} {
      display: none;
    }
  }

  tbody tr:nth-child(odd) {
    background-color: var(--lido-color-accentControlBg);
  }
`;

export const SortButton = styled(Button).attrs({
  variant: 'text',
  color: 'secondary',
  size: 'xs',
})`
  padding: 6px 12px;
  min-width: auto;

  > span {
    display: flex;
    gap: ${({ theme }) => theme.spaceMap.xs}px;
    align-items: center;
  }

  svg {
    width: 16px;
    height: 16px;
    margin-block: -2px;
  }
`;
