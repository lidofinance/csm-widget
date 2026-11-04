import { Card } from '@lidofinance/lido-app-ui';
import { Form } from 'shared/hook-form/form-controller';
import styled from 'styled-components';

export const CardStackStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
`;

export const FormCardStackStyle = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
`;

export const RoleCardStyle = styled(Card)`
  && {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

export const RoleCardHeaderStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 16px;
`;

export const RoleCardTitleStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const PendingIconStyle = styled.span`
  display: inline-flex;
  color: var(--lido-app-ui-color-icons-warning);

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const RoleAddressStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const TxAddressStyle = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const StepsListStyle = styled.ol`
  margin: 0;
  padding-left: 20px;
`;
