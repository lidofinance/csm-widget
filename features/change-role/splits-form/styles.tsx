import { Button, Typography } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const SectionStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
`;

export const ShareRowStyle = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px;
  align-items: end;
  gap: 12px;

  @media (max-width: 439px) {
    grid-template-columns: minmax(0, 1fr) 96px;
  }
`;

export const EditShareRowStyle = styled(ShareRowStyle)`
  grid-template-columns: minmax(0, 1fr) 120px 40px;

  @media (max-width: 439px) {
    grid-template-columns: minmax(0, 1fr) 96px 40px;
  }
`;

export const RemoveButtonCellStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
`;

export const SecondaryTextStyle = styled(Typography)`
  && {
    color: var(--lido-app-ui-color-text-secondary);
  }
`;

export const BulletsStyle = styled.ul`
  margin: 0;
  padding-left: 20px;
`;

export const CtaStackStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FullWidthButtonStyle = styled(Button)`
  && {
    width: 100%;
  }
`;

export const ButtonsStyle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const RecipientStyle = styled.span`
  min-width: 0;
  overflow-wrap: anywhere;
`;
