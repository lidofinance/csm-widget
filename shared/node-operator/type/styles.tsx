import { Button, ButtonProps } from '@lidofinance/lido-ui';
import styled from 'styled-components';
import { DescriptorText } from '../descriptor/styles';
import { NAV_MOBILE_MEDIA } from 'styles/constants';
import { OPERATOR_TYPE } from 'consts';
import { CURVE_VARIANTS } from '../curve-badge/styles';

export const ButtonStyle = styled((props: ButtonProps) => (
  <Button {...props} />
))<{
  $variant?: OPERATOR_TYPE;
}>`
  flex-shrink: 1;
  min-width: unset;
  overflow: hidden;

  ${({ $variant }) => ($variant ? CURVE_VARIANTS[$variant] : '')}
`;

export const ButtonWrapperStyle = styled.span`
  display: flex;
  margin: -8px -16px;

  ${DescriptorText} {
    ${NAV_MOBILE_MEDIA} {
      display: none;
    }
  }
`;
