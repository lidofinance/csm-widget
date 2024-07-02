import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

export const Row = styled(StackStyle).attrs({ $gap: 'sm' })`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  padding: 12px 16px;

  background: var(--lido-color-backgroundSecondary);
`;

export const ItemStyled = styled(StackStyle).attrs({
  $direction: 'column',
  $gap: 'xs',
})<{ $secondary?: boolean; $warning?: boolean }>`
  flex: 1 0 20%;

  font-size: 14px;
  line-height: 24px;

  color: var(
    ${({ $secondary, $warning }) =>
      $secondary
        ? '--lido-color-textSecondary'
        : $warning
          ? '--lido-color-error'
          : '--lido-color-text'}
  );
  text-align: center;
`;

export const CountStyled = styled.b`
  font-size: 16px;
  font-weight: 700;
`;
