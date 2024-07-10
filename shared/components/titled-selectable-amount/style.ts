import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

export const TitledAmountStyle = styled(StackStyle)<{ $warning?: boolean }>`
  justify-content: space-between;
  align-items: center;

  color: var(
    ${({ $warning }) => ($warning ? '--lido-color-error' : '--lido-color-text')}
  );
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;

  label > svg + div {
    margin: 0;

    p {
      color: inherit;
    }
  }
`;
