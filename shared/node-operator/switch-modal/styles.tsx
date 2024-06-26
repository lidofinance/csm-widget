import { Stack, StackItem } from '@lidofinance/lido-ui';
import styled from 'styled-components';

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
`;

export const IdStyle = styled.span``;
export const RolesStyle = styled.div``;

export const ActionsStyle = styled.div``;

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

export const StyledStack = styled(Stack)`
  margin-top: ${({ theme }) => theme.spaceMap.lg}px;
`;

export const StyledStackItem = styled(StackItem)`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  align-items: center;
  flex-grow: 1;
`;
