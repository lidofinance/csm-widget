import styled from 'styled-components';
import { FormController } from './form-controller';

export const FormControllerStyled = styled(FormController)`
  display: flex;
  flex-direction: column;
  row-gap: ${({ theme }) => theme.spaceMap.md}px;
`;
