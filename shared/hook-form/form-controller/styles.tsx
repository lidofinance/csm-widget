import styled from 'styled-components';
import { FormController } from './form-controller';
import { Theme } from '@lidofinance/lido-ui';

export const FormControllerStyled = styled(FormController)<{
  $gap?: keyof Theme['spaceMap'];
}>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap = 'md', theme }) => theme.spaceMap[$gap]}px;
`;
