import { Card } from '@lidofinance/lido-app-ui';
import { Form } from 'shared/hook-form/form-controller';
import styled from 'styled-components';

export const FormCardStackStyle = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const RoleCardStyle = styled(Card)`
  && {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

export const StepsListStyle = styled.ol`
  margin: 0;
  padding-left: 20px;
`;
