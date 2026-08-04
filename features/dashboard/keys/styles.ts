import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  gap: 12px;
`;

export const ItemStyled = styled(StackStyle).attrs({
  $direction: 'column',
  $gap: 'xs',
})<{ $secondary?: boolean }>`
  display: flex;
  flex: 1 0 auto;
  font-size: 12px;
  line-height: 20px;

  color: var(
    ${({ $secondary }) =>
      $secondary ? '--lido-color-textSecondary' : '--lido-color-text'}
  );
  text-align: left;
  justify-content: start;

  flex-direction: column-reverse;
`;

export const CountStyled = styled.b`
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
`;
