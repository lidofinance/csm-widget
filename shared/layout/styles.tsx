import { Main } from '@lidofinance/lido-app-ui';
import { H1 } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const Heading = styled.header<{ $titlesCount: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xs}px;

  margin-bottom: ${({ theme, $titlesCount }) =>
    $titlesCount < 2 ? theme.spaceMap.xxl : theme.spaceMap.md}px;

  max-width: 100%;
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

export const MainStyled = styled(Main)`
  position: relative;
`;

export const PageBody = styled.div`
  display: flex;
  flex-direction: column;
`;
