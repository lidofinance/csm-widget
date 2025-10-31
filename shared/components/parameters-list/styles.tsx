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

export const CompareListStyle = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 4fr 5fr 5fr;
  column-gap: ${({ theme }) => theme.spaceMap.sm}px;
  row-gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const ColumnBackground = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  bottom: -8px;
  width: calc((100% + 8px) * 5 / 14 - 2px);
  border-radius: 12px;
  opacity: 0.6;
  pointer-events: none;
  z-index: 0;
`;

export const IcsColumnBackground = styled(ColumnBackground)`
  ${CURVE_VARIANTS[OPERATOR_TYPE.ICS]}
`;

export const DefColumnBackground = styled(ColumnBackground)`
  right: auto;
  left: calc((100% + ${({ theme }) => theme.spaceMap.sm}px) * 4 / 14);
  ${CURVE_VARIANTS[OPERATOR_TYPE.DEF]}
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
`;

export const CompareTitleStyle = styled(CompareRowStyle)`
  &:not(:last-child):after {
    content: none;
  }

  p {
    padding-left: 1em;
  }
`;
