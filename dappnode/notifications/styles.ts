import styled from 'styled-components';
import { Input } from '@lidofinance/lido-ui';
import { TitledAddressStyle } from 'shared/components/titled-address/style';

export const InfoWrapper = styled(TitledAddressStyle)`
  padding: 22px 16px;
  width: 100%;
  > p {
    font-weight: lighter;
    font-size: 14px;
    text-align: right;
  }
`;

export const BotTokenWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

export const StyledInput = styled(Input)`
  width: 100%;
  input + span {
    overflow: visible;
  }
`;

export const EyeIcon = styled.div`
  cursor: pointer;
  display: flex;
  margin-right: 5px;
`;

export const NotificationsList = styled.ul`
  font-size: 14px;
  > li {
    margin-bottom: 20px;
  }
`;
