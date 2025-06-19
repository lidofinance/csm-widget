import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';
import { BadgeRoleStyle } from '../role-badge/styles';

export const ListStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const RowStyle = styled.div`
  display: flex;
  justify-content: space-between;

  background-color: var(--lido-color-backgroundSecondary);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
`;

export const ContentStyle = styled.div`
  display: flex;
  align-items: center;

  ${BadgeRoleStyle} {
    background: var(--lido-color-shadowLight);
  }
`;

export const IdStyle = styled.span``;
export const RolesStyle = styled.div``;

export const ActionsStyle = styled.div`
  align-self: center;
`;

export const ButtonWrapperStyle = styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: -8px -16px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: normal;
  line-height: 20px;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const StyledStack = styled(StackStyle)`
  margin-top: ${({ theme }) => theme.spaceMap.lg}px;
  flex-wrap: wrap;
`;

export const StyledStackItem = styled(StackStyle).attrs({ $gap: 'sm' })`
  align-items: center;
  flex-grow: 1;
`;
