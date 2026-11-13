import styled from 'styled-components';

export const CommentStyle = styled.span`
  color: var(--lido-app-ui-color-text-secondary);
  font-size: var(--lido-app-ui-font-size-label);
  line-height: var(--lido-app-ui-space-24);

  &:empty {
    display: none;
  }
`;
