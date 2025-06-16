import { ArrowBottom, Link } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';
import { StackStyle } from '../stack/style';

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

export const ListStyle = styled(StackStyle).attrs({
  $direction: 'column',
  $gap: 'xl',
})``;

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
  grid-template-columns: 1fr minmax(auto, 300px);
  align-items: start;
  gap: ${({ theme }) => theme.spaceMap.sm}px;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--lido-color-popupMenuItemBgActiveHover);
    opacity: 0.12;
  }

  ${({ $bordered }) =>
    $bordered
      ? css`
          &:is(:last-child)::after {
            content: '';
            position: absolute;
            bottom: -12px;
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
  grid-template-columns: 4fr 5fr 5fr;
`;

export const CompareTitleStyle = styled(CompareRowStyle)`
  &:not(:last-child)::after {
    content: none;
  }

  p {
    padding-left: 1em;
  }
`;
