import { Container, H1 } from '@lidofinance/lido-ui';
import styled from 'styled-components';

import { NAV_MOBILE_MEDIA } from 'styles/constants';

export const LayoutStyle = styled(Container)`
  --layout-main-width: 590px;
  --layout-side-width: 170px;

  position: relative;
  min-height: 100vh;
  display: grid;
  grid-template-columns: var(--layout-side-width) 1fr var(--layout-side-width);
  grid-template-rows: auto 1fr auto;
  grid-column-gap: 14px;
  grid-template-areas:
    'header header header'
    'nav main alerts'
    'footer footer footer';

  ${({ theme }) => theme.mediaQueries.xl} {
    grid-template-columns: var(--layout-side-width) 1fr;
    grid-template-rows:
      auto auto 1fr
      auto;
    grid-template-areas:
      'header header'
      'nav alerts'
      'nav main'
      'footer footer';

    &:has(nav[hidden]),
    &:not(:has(nav)) {
      grid-template-columns: 1fr;
      grid-template-areas:
        'header'
        'alerts'
        'main'
        'footer';
    }
  }

  ${NAV_MOBILE_MEDIA} {
    grid-template-rows: auto auto 1fr auto;
    grid-template-columns: 1fr;
    grid-template-areas:
      'header'
      'alerts'
      'main'
      'footer';
  }
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

  max-width: var(--layout-main-width);
`;
