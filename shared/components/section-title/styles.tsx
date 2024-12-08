import styled from 'styled-components';
import { LocalLink } from 'shared/navigate';

export const SectionHeaderStyle = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
`;

export const SectionTitleStyle = styled.h2`
  font-weight: 800;
  font-size: ${({ theme }) => theme.fontSizesMap.md}px;
  line-height: 1.3em;
  color: var(--lido-color-text);
`;

export const SectionHeaderLinkStyle = styled(LocalLink)`
  display: flex;
  align-items: center;
  width: fit-content;

  &:hover svg {
    transform: translateX(2px);
  }
`;
