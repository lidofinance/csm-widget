import styled from 'styled-components';

export const AddressGroupingNoteStyle = styled.div`
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  background: var(--lido-color-backgroundSecondary);
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
`;
