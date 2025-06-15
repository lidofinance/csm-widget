import { ArrowBottom, Link } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const ArrowStyle = styled(ArrowBottom)<{ $expanded: boolean }>`
  vertical-align: middle;
  flex-shrink: 0;
  transform: rotate(${(props) => (props.$expanded ? 180 : 0)}deg);
  transition: transform ${({ theme }) => theme.duration.norm} ease;
`;

export const ButtonStyle = styled(Link)`
  text-align: center;
  font-weight: 700;
  font-size: 14px;
`;

export const ListStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const RowStyle = styled.div`
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
