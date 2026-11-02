import { Button, DataList } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const HeaderStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
`;

export const HeadingStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StepContentStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
`;

export const GateParamsStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 24px;
  margin-top: 12px;

  @media (max-width: 439px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const ParamGroupStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const CompactListStyle = styled(DataList)`
  && {
    padding: 0;
  }
`;

export const SummaryStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ParamLinesStyle = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

export const AddressValueStyle = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  word-break: break-all;
`;

export const AsideButtonStyle = styled(Button)`
  && {
    width: 100%;
  }
`;

export const SubmitGuardStyle = styled.div`
  display: contents;
`;
