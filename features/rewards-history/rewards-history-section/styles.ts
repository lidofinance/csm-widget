import styled, { css } from 'styled-components';
import { MEDIA_QUERY_XXL } from 'styles';

export const TableStyle = styled.table`
  overflow-x: auto;
  border-collapse: collapse;

  display: grid;
  grid-template-columns: 2fr 3fr 1fr 1fr 1fr 2fr;

  thead,
  tbody,
  tr {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
  }

  th {
    text-align: left;
    color: var(--lido-color-text);
  }

  tr {
    align-items: center;
    padding-inline: 32px;
    padding-block: 12px;
    gap: 20px;

    ${MEDIA_QUERY_XXL} {
      padding-inline: 16px;
      gap: 12px;
    }
  }

  thead tr {
    padding-block: 24px 16px;
  }

  tbody tr:nth-child(odd) {
    background-color: var(--lido-color-accentControlBg);
  }

  th:nth-child(n + 3):nth-child(-n + 6),
  td:nth-child(n + 3):nth-child(-n + 6) {
    justify-self: right;
    text-align: right;
  }

  tbody {
    color: var(--lido-color-text);
  }
`;

export const DatesWrapper = styled.span`
  white-space: nowrap;
`;

export const PerformanceStyled = styled.span<{ $error?: boolean }>`
  font-weight: 700;

  ${({ $error }) =>
    $error &&
    css`
      color: var(--lido-color-error);
    `}
`;
