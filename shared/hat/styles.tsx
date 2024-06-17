import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';

export const HatStyle = styled(Block)`
  margin-bottom: -44px;

  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;

  padding-bottom: ${({ theme }) =>
    theme.borderRadiusesMap.xl + theme.spaceMap.xxl}px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-bottom: ${({ theme }) =>
      theme.borderRadiusesMap.xl + theme.spaceMap.lg}px;
  }
`;

export const HatRowStyle = styled.div`
  display: flex;
  margin: ${({ theme }) => theme.spaceMap.lg}px 0;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const HatFloatStyle = styled.div`
  float: right;
`;

export const HatBalanceStyle = styled.div`
  margin-right: 18px;
  flex-basis: 50%;
  flex-grow: 1;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 1.6em;

  :last-child {
    margin-right: 0;
  }
`;

export const HatTitleStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  line-height: 24px;
`;

export const HatValueStyle = styled.div<{ $small: boolean }>`
  margin-top: 2px;
  font-size: ${({ theme, $small }) =>
    $small ? theme.fontSizesMap.sm : theme.fontSizesMap.md}px;
  line-height: 1.4em;
  font-weight: 800;
  white-space: nowrap;
`;

export const HatExtraStyle = styled.div`
  margin-top: 2px;
  opacity: 0.5;
`;

export const HatContentStyle = styled.div<{ $hidden: boolean }>`
  margin-top: 8px;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
`;

export const HatAccountStyle = styled.div`
  align-self: stretch;
  display: flex;
  flex-basis: 50%;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  align-items: center;
  justify-content: flex-end;
  margin-left: auto;

  & > * {
    cursor: pointer;
  }
`;

export const BalanceRowStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
`;

export const BalanceValueStyle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  min-width: 100px;
`;

export const BalanceIconStyle = styled.div`
  display: flex;
  flex-shrink: 0;
`;
