import styled from 'styled-components';

import { LocalLink } from 'shared/components/local-link';

export const SwitchWrapper = styled.div<{ $count: number }>`
  width: 268px;
  width: ${({ $count }) => `${$count * 134}px`};
  height: 44px;
  background-color: var(--lido-color-backgroundDarken);
  border-radius: 22px;
  position: relative;
  :hover {
    cursor: pointer;
  }
  display: flex;
  justify-content: space-around;
  align-items: center;
  user-select: none;
  margin: 0 auto 24px auto;
`;

export const Handle = styled.div<{ $active: number }>`
  width: 130px;
  height: 40px;
  background-color: var(--lido-color-foreground);
  border-radius: 20px;
  position: absolute;
  left: ${({ $active }) => `calc(2px + ${$active * 134}px)`};
  transition: left 0.3s ease;
  top: 2px;
  z-index: 1;
`;

// Not wrapping <a> inside <a> in IPFS mode
// Also avoid problems with migrate to Next v13
// see: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#link-component
export const SwitchItemStyled = styled(LocalLink)<{ $active: boolean }>`
  z-index: 2;
  margin: 0;
  opacity: ${({ $active }) => ($active ? 1 : 0.5)};
  transition: opacity 0.3s ease;
  flex: 1;
  display: flex;
  align-items: center;
  text-decoration: none;
  justify-content: center;
  height: 100%;

  font-size: ${({ theme }) => theme.fontSizesMap.xxxs}px;
  line-height: 2.4em;
  font-weight: 800;
  text-align: center;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: var(--lido-color-text);

  &:hover {
    color: var(--lido-color-text);
    opacity: 1;
  }

  &:visited {
    color: var(--lido-color-text);
  }
`;
