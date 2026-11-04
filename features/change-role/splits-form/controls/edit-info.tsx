import { MessageBox } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { BulletsStyle } from '../styles';

export const EditInfo: FC = () => (
  <MessageBox variant="info" headline="Set up rewards splitter addresses">
    <BulletsStyle>
      <li>Split rewards across up to 10 additional addresses</li>
      <li>Additional addresses receive rewards in stETH only</li>
      <li>
        Claiming is permissionless: anyone can execute the claim, but rewards go
        only to the configured addresses
      </li>
    </BulletsStyle>
  </MessageBox>
);
