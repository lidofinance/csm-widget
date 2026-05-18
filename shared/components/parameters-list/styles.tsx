import { ArrowBottom, Link } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { CURVE_VARIANTS } from '../../node-operator/curve-badge/styles';

export const ArrowStyle = styled(ArrowBottom)<{ $expanded: boolean }>`
  vertical-align: middle;
  flex-shrink: 0;
  transform: rotate(${(props) => (props.$expanded ? 180 : 0)}deg);
  transition: transform ${({ theme }) => theme.duration.norm} ease;
`;

export const MoreStyle = styled(Link)`
  text-align: center;
  font-weight: 700;
  font-size: 14px;
`;

export const ListStyle = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(auto, 300px);
  column-gap: ${({ theme }) => theme.spaceMap.sm}px;
  row-gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const CompareListStyle = styled.div<{ $columns: number }>`
  --columns: ${({ $columns }) => $columns};
  --title-fr: ${({ $columns }) => ($columns > 2 ? 3 : 4)};
  --col-fr: 5;
  --total-fr: calc(var(--title-fr) + var(--col-fr) * var(--columns));
  position: relative;
  display: grid;
  grid-template-columns: ${({ $columns }) => ($columns > 2 ? 3 : 4)}fr repeat(
      ${({ $columns }) => $columns},
      5fr
    );
  column-gap: ${({ theme }) => theme.spaceMap.sm}px;
  row-gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const ColumnBackground = styled.div<{ $index: number }>`
  --border-radius: 12px;
  position: absolute;
  top: -8px;
  bottom: -8px;
  left: calc(
    100% * (var(--title-fr) + var(--col-fr) * ${({ $index }) => $index}) /
      var(--total-fr) + 2px
  );
  width: calc(100% * var(--col-fr) / var(--total-fr) - 4px);
  border-radius: var(--border-radius);
  pointer-events: none;
  opacity: 0.6;
  z-index: 0;

  &:before {
    --offset: 2px;
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: var(--offset);

    border-radius: calc(var(--border-radius) - var(--offset));
    background: var(--lido-color-foreground);
    opacity: 0.9;
  }
`;

export const IcsColumnBackground = styled(ColumnBackground)`
  ${CURVE_VARIANTS[OPERATOR_TYPE.CSM_ICS]}
`;

export const IdvtcColumnBackground = styled(ColumnBackground)`
  ${CURVE_VARIANTS[OPERATOR_TYPE.CSM_IDVTC]}
`;

export const DefColumnBackground = styled(ColumnBackground)`
  ${CURVE_VARIANTS[OPERATOR_TYPE.CSM_DEF]}
`;

export const FoldableListStyle = styled(ListStyle)<{ $folded?: boolean }>`
  overflow: hidden;
  transition:
    max-height ${({ theme }) => theme.duration.norm} ease,
    height ${({ theme }) => theme.duration.norm} ease;
  max-height: ${({ $folded }) => ($folded ? '0' : '1000px')};
  margin-top: ${({ $folded, theme }) =>
    $folded ? `-${theme.spaceMap.xl}px` : '0'};
`;

export const RowStyle = styled.div<{ $bordered?: boolean }>`
  position: relative;
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: start;

  &:not(:last-child):after {
    content: '';
    position: absolute;
    bottom: calc(-${({ theme }) => theme.spaceMap.xl}px / 2);
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--lido-color-popupMenuItemBgActiveHover);
    opacity: 0.12;
  }

  ${({ $bordered }) =>
    $bordered
      ? css`
          &:is(:last-child):after {
            content: '';
            position: absolute;
            bottom: calc(-${({ theme }) => theme.spaceMap.xl}px / 2);
            left: 0;
            width: 100%;
            height: 1px;
            background: var(--lido-color-popupMenuItemBgActiveHover);
            opacity: 0.12;
          }
        `
      : ''}
`;

export const CompareRowStyle = styled(RowStyle)`
  z-index: 1;

  & > :not(:first-child) {
    padding-right: 10px;
  }
`;

export const CompareTitleStyle = styled(CompareRowStyle)`
  &:not(:last-child):after {
    content: none;
  }

  p {
    padding-left: 1em;
  }
`;
