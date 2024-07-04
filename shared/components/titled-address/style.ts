import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

export const TitledAddressStyle = styled(StackStyle)`
  justify-content: space-between;
  align-items: center;

  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
`;
