import { Button, ButtonProps } from '@lidofinance/lido-ui';
import styled from 'styled-components';
import { DescriptorText } from '../descriptor/styles';

export const ButtonStyle = styled((props: ButtonProps) => (
  <Button {...props} />
))`
  flex-shrink: 1;
  min-width: unset;
  overflow: hidden;
`;

export const ButtonWrapperStyle = styled.span`
  display: flex;
  margin: -8px -16px;

  ${DescriptorText} {
    ${({ theme }) => theme.mediaQueries.md} {
      display: none;
    }
  }
`;
