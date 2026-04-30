import styled from 'styled-components';

export const PendingChangeStyle = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  align-items: center;
  background: rgba(236, 134, 0, 0.1);
  border-radius: 4px;
  padding: 4px 6px;
  overflow: hidden;

  color: var(--lido-color-warning);
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;

  & > span {
    white-space: nowrap;
  }

  svg {
    width: 14px;
    height: 12px;
    flex-shrink: 0;
  }
`;
