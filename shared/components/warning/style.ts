import styled from 'styled-components';

export const WarningTextStyle = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  align-items: center;

  color: var(--lido-color-warning);
  font-weight: 700;

  svg {
    width: 16px;
    height: 16px;
  }
`;
