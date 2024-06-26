import { BadgeStyle } from 'shared/node-operator/role-badge/styles';
import styled from 'styled-components';

export const InviteContentStyle = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  color: var(--lido-color-text);
`;

export const Badge = styled(BadgeStyle).attrs({ $background: 'dark' })``;
