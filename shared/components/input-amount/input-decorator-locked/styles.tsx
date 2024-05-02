import styled from 'styled-components';

export const LockWrapper = styled.span`
  position: relative;
  line-height: 0;
  padding: 4px;
  display: inline-block;
  vertical-align: top;
  margin-left: 8px;
  cursor: default;
  color: var(--lido-color-textSecondary);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm}px;

  :first-child {
    margin-left: 0;
  }
`;
