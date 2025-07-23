import { LocalLink } from 'shared/navigate/local-link';
import styled from 'styled-components';

export const SectionHeaderLinkStyle = styled(LocalLink)`
  display: flex;
  align-items: center;
  width: fit-content;

  &:hover svg {
    transform: translateX(2px);
  }
`;
