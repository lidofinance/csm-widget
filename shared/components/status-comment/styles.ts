import styled from 'styled-components';

export const CommentStyle = styled.span`
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.spaceMap.xl}px;
`;
