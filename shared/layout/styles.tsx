import { Container, H1 } from '@lidofinance/lido-ui';
import styled from 'styled-components';

import { NAV_MOBILE_MEDIA } from 'styles/constants';

export const LayoutStyle = styled(Container)`
  display: grid;
  grid-template-columns: 180px auto 180px;
  grid-template-rows: 80px auto 72px;
  grid-gap: 1em;
  grid-template-areas:
    'header header header'
    'sidebar main alerts'
    'footer footer footer';
`;

export const Heading = styled.header<{ $titlesCount: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xs}px;

  margin-bottom: ${({ theme, $titlesCount }) =>
    $titlesCount < 2 ? theme.spaceMap.xxl : theme.spaceMap.md}px;
`;

export const LayoutTitleStyle = styled(H1)`
  font-weight: 800;
  font-size: ${({ theme }) => theme.fontSizesMap.xl}px;
  line-height: 1.46em;
  text-align: center;

  &:empty {
    display: none;
  }
`;

export const LayoutSubTitleStyle = styled.p`
  font-weight: 500;
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 1.66em;
  text-align: center;

  &:empty {
    display: none;
  }
`;

export const IPFSInfoBoxOnlyMobileAndPortableWrapper = styled.div`
  display: none;

  ${NAV_MOBILE_MEDIA} {
    display: block;
    margin-top: -6px;
    margin-bottom: 40px;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xl}px;

  > * {
    width: 100%;
  }
`;

export const Main = styled.main`
  grid-area: main;
  position: relative;
  margin-inline: auto;
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
  margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
  padding: 0;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 20px;
  }

  max-width: 590px;
`;
