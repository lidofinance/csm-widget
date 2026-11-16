import { IconChevronDown } from '@lidofinance/lido-app-ui';
import styled, { css } from 'styled-components';

const MOBILE = '@media screen and (max-width: 479px)';
const DIVIDER = css`
  content: '';
  position: absolute;
  bottom: -12px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--lido-app-ui-color-border-default);
`;

export const ArrowStyle = styled(IconChevronDown)<{ $expanded: boolean }>`
  flex-shrink: 0;
  transform: rotate(${(props) => (props.$expanded ? 180 : 0)}deg);
  transition: transform 0.2s ease;
`;

export const ListStyle = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(auto, 300px);
  column-gap: 8px;
  row-gap: 24px;
`;

export const CompareListStyle = styled.div<{ $columns: number }>`
  --columns: ${({ $columns }) => $columns};
  position: relative;
  display: grid;
  grid-template-columns: ${({ $columns }) => ($columns > 2 ? 3 : 4)}fr repeat(
      ${({ $columns }) => $columns},
      5fr
    );
  column-gap: 8px;
  row-gap: 24px;

  ${MOBILE} {
    grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
  }
`;

export const FoldableListStyle = styled(ListStyle)<{ $folded?: boolean }>`
  overflow: hidden;
  transition:
    max-height 0.2s ease,
    height 0.2s ease;
  max-height: ${({ $folded }) => ($folded ? '0' : '1000px')};
  margin-top: ${({ $folded }) => ($folded ? '-24px' : '0')};
`;

export const RowStyle = styled.div<{ $bordered?: boolean }>`
  position: relative;
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: start;

  &:not(:last-child):after {
    ${DIVIDER}
  }

  ${({ $bordered }) =>
    $bordered &&
    css`
      &:is(:last-child):after {
        ${DIVIDER}
      }
    `}
`;

export const CompareRowStyle = styled(RowStyle)`
  & > :not(:first-child) {
    padding-right: 10px;
  }

  ${MOBILE} {
    row-gap: 4px;
    column-gap: 8px;

    & > * {
      min-width: 0;
      overflow-wrap: break-word;
      padding-right: 0;
    }

    & > :first-child {
      grid-column: 1 / -1;
    }

    ul {
      padding-inline-start: 1.1em;
    }
  }
`;

export const CompareTitleStyle = styled(CompareRowStyle)`
  &:not(:last-child):after {
    content: none;
  }

  p {
    padding-left: 1em;
  }

  ${MOBILE} {
    & > p:first-child {
      display: none;
    }
  }
`;
