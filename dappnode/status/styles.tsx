import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

export const Card = styled(StackStyle).attrs({ $gap: 'sm' })`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  padding: 12px 16px;
  background: var(--lido-color-backgroundSecondary);
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const Row = styled(StackStyle).attrs({ $gap: 'sm' })`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: column;
    gap: 12px;
  }
`;

export const ItemStyled = styled(StackStyle).attrs({
  $direction: 'column',
  $gap: 'xs',
})<{ $warning?: boolean }>`
  padding-top: 1rem;
  padding-bottom: 1rem;
  flex: 1 0 20%;
  row-gap: 8px;
  font-size: 14px;

  color: var(
    ${({ $warning }) => ($warning ? '--lido-color-error' : '--lido-color-text')}
  );
  text-align: center;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

export const TitleStyled = styled.b`
  font-size: 14px;
  font-weight: 700;
`;
export const SubtitleStyled = styled.p`
  font-size: 12px;
`;

export const WarningCard = styled(StackStyle).attrs<{ $hasWarning?: boolean }>(
  (props) => ({
    $hasWarning: props.$hasWarning ?? true,
  }),
)<{ $hasWarning?: boolean }>`
  justify-content: center;
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  padding: 12px 16px;
  background: ${({ $hasWarning }) =>
    $hasWarning
      ? 'color-mix(in srgb, var(--lido-color-error) 15%, transparent)'
      : 'var(--lido-color-backgroundSecondary)'};

  button {
    border: none;
    background: none;
  }
`;

export const NumWarningsLabel = styled.span`
  font-weight: 600;
  color: red;
`;

export const ValidatorMapStack = styled(StackStyle)`
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 100%;
  }
`;

export const AddressRow = styled(StackStyle).attrs({ $gap: 'xs' })`
  align-items: center;
  justify-content: center;
`;

export const Center = styled(StackStyle).attrs({ $gap: 'sm' })`
  justify-content: center;
  text-align: center;
`;
