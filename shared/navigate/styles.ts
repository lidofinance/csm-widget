import styled from 'styled-components';
import { LocalLink } from './local-link';

export const SecondaryLocalLink = styled(LocalLink)`
  display: inline-flex;
  font-weight: normal;
  width: max-content;

  &,
  &:visited {
    color: var(--lido-color-textSecondary);
  }
  &:hover {
    color: var(--lido-color-primary);
  }

  svg {
    color: currentColor;
  }
`;

export const TextLocalLink = styled(SecondaryLocalLink)`
  &,
  &:visited {
    color: var(--lido-color-text);
  }

  svg {
    color: var(--lido-color-textSecondary);
  }

  &:hover {
    color: var(--lido-color-primary);
    svg {
      color: currentColor;
    }
  }
`;
