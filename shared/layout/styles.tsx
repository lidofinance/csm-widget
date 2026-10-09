import { Container, H1 } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';

export const Shell = styled.div`
  display: flex;
  align-items: flex-start;
  min-width: 0;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const SINGLE_COLUMN_MEDIA = '@media screen and (max-width: 1299px)';

export const LayoutStyle = styled(Container)<{ $fullwidth?: boolean }>`
  --layout-base-width: 590px;
  --layout-main-width: ${({ $fullwidth }) =>
    $fullwidth ? '1204px' : 'var(--layout-base-width)'};
  --layout-side-width: 170px;
  --layout-gutter: ${({ theme }) => theme.spaceMap.xxl}px;

  position: relative;
  width: 100%;
  flex: 1;
  min-width: 0;
  min-height: calc(100vh - var(--test-env-banner-height, 0px));
  display: grid;
  grid-template-columns: var(--layout-side-width) 1fr var(--layout-side-width);
  grid-template-rows: auto 1fr auto;
  grid-column-gap: 14px;
  grid-template-areas:
    'header header header'
    '. main alerts'
    'footer footer footer';

  ${SINGLE_COLUMN_MEDIA} {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr auto;
    grid-template-areas:
      'header'
      'alerts'
      'main'
      'footer';
  }

  ${({ $fullwidth }) =>
    $fullwidth &&
    css`
      grid-template-columns: 1fr;
      grid-template-rows: auto auto 1fr auto;
      grid-template-areas:
        'header'
        'alerts'
        'main'
        'footer';
    `}

  ${({ theme }) => theme.mediaQueries.lg} {
    --layout-gutter: ${({ theme }) => theme.spaceMap.lg}px;
  }
`;

export const Heading = styled.header<{ $titlesCount: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xs}px;

  margin-bottom: ${({ theme, $titlesCount }) =>
    $titlesCount < 2 ? theme.spaceMap.xxl : theme.spaceMap.md}px;

  max-width: var(--layout-base-width);
  align-self: center;
`;

export const LayoutTitleStyle = styled(H1)`
  font-weight: 800;
  font-size: ${({ theme }) => theme.fontSizesMap.xl}px;
  line-height: 1.46em;
  text-align: center;
  text-wrap: balance;

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
  display: flex;
  flex-direction: column;

  grid-area: main;
  position: relative;
  margin-inline: auto;
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
  margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
  padding: 0;
  width: 100%;
  min-width: 0;

  max-width: var(--layout-main-width);
`;
