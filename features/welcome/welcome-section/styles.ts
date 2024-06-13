import { Block } from '@lidofinance/lido-ui';
import styled from 'styled-components';

import LogoImg from 'assets/csm.png';

export const Header = styled.h1`
  font-size: 48px; // @style
  line-height: 52px; // @style
  font-weight: 600;
`;

export const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-inline: 32px;

  line-height: 52px;
  color: var(--lido-color-text);

  @media screen and (max-width: 540px) {
    padding-inline: 0;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  text-align: left;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;

  ul {
    color: var(--lido-color-primary);
    padding-inline-start: 22px;
  }
`;

export const BlockStyled = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
  border-radius: 32px; // @style

  text-align: center;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const CSMLogo = styled.img.attrs({
  alt: '',
  src: LogoImg.src,
})`
  width: 55%;
  display: flex;
  align-self: center;
  margin-bottom: -4%;
`;
