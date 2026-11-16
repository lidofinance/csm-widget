import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { ClaimTypeSuccess } from '../shared';

export const ClaimIcsSuccess: FC = () => (
  <ClaimTypeSuccess
    type={OPERATOR_TYPE.CSM_ICS}
    description={
      <>
        You have claimed the Identified Community Staker operator type.
        <br />
        You can see the new parameters for your Node Operator by opening the
        operator switcher in the sidebar and clicking the ICS tag.
      </>
    }
  />
);
