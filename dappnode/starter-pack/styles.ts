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
  gap: 8px;

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
  gap: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: 32px; // @style

  text-align: center;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
`;

export const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 450px;
  padding: 16px 40px; // @style
  border-radius: 10px;
  background: ${({ theme }) =>
    theme.name === ThemeName.light ? '#eff2f6' : '#3e3d46'};
`;

export const Number = styled.div`
  display: flex;
  width: 60px;
  height: 60px;
  margin-bottom: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background: var(--lido-color-foreground);

  color: var(--lido-color-textSecondary);
  font-size: 32px;
  font-weight: 700;
`;
export const StepTitle = styled.h3`
  font-size: 20px;
  font-weight: 500;
`;

export const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 40%;
  align-items: center;
  text-align: center;
  justify-content: space-evenly;
  gap: 10px;
  padding-top: 10px;

  p {
    color: var(--lido-color-textSecondary);
    font-size: 15px;
    font-weight: 400;
    text-align: left;
    width: 100%;
    line-height: 20px;
  }
`;

export const Step2InfraRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 100%;
  }
  & > p {
    flex: 1;
    width: 100%;
    font-size: 14px;
    text-align: center;
  }
`;

export const InfraInstalledLabel = styled.span<{ $isInstalled: boolean }>`
  color: var(
    ${({ $isInstalled }) =>
      $isInstalled ? '--lido-color-success' : '--lido-color-error'}
  );
  font-weight: 600;
`;

export const ButtonsRow = styled.div`
  width: 100%;

  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  Button,
  .button-wrapper {
    flex: 1 1 0%;
  }
`;
