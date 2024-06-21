import { H1 } from '@lidofinance/lido-ui';
import styled from 'styled-components';

import { NAV_MOBILE_MEDIA } from 'styles/constants';

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
  line-height: 1.2em;
  text-align: center;

  &:empty {
    display: none;
  }
`;

export const LayoutSubTitleStyle = styled.p`
  font-weight: 500;
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 1.5em;
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
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;
