import { Block, ThemeName } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const Header = styled.h1`
  font-size: 48px; // @style
  line-height: 52px; // @style
  font-weight: 600;
`;

export const Heading = styled.header`
  display: flex;
  flex-direction: column;
  gap: 2px;

  h2 {
    font-size: 20px;
    font-weight: 700;
    line-height: 28px;
  }

  p {
    color: var(--lido-color-textSecondary);
    font-size: 12px;
    line-height: 20px;
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
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  border-radius: 32px; // @style

  text-align: center;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
`;

export const Steps = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const StepWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  flex: 1 0 40%;
  align-items: center;
  padding: 16px 20px; // @style

  border-radius: 10px;
  background: ${({ theme }) =>
    theme.name === ThemeName.light ? '#eff2f6' : '#6d6d6d'};
`;

export const Number = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;

  border-radius: 99px;
  background: #fff;

  color: #7a8aa0;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
`;

export const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  flex: 1 0 40%;
  text-align: left;

  h3 {
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
  }

  p {
    color: var(--lido-color-textSecondary);
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
  }
`;
