import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { ClaimTypeSuccess } from '../shared';
import { DkgRequiredCard } from './dkg-required-card';

export const ClaimIdvtcSuccess: FC = () => (
  <ClaimTypeSuccess
    type={OPERATOR_TYPE.CSM_IDVTC}
    description={
      <>
        You have claimed the Identified DVT Cluster operator type.
        <br />
        You can see the new parameters for your Node Operator by opening the
        operator switcher in the sidebar and clicking the IDVTC tag.
      </>
    }
    notice={<DkgRequiredCard />}
  />
);
