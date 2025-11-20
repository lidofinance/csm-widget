import styled from 'styled-components';

export const Table = styled.table`
  overflow-x: auto;
  border-collapse: collapse;
  display: grid;

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
  }

  thead tr {
    padding-block: 24px 16px;
  }

  tbody tr:nth-child(odd) {
    background-color: var(--lido-color-accentControlBg);
  }

  tbody {
    color: var(--lido-color-text);
  }
`;
