import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { DkgRequiredCard } from 'features/idvtc/dkg/components/dkg-required-card';
import { useHasNonWithdrawnKeys, useNodeOperatorId } from 'modules/web3';
import { FC } from 'react';
import { useNavigate } from 'shared/navigate';
import { ClaimTypeSuccess } from '../shared';

export const ClaimIdvtcSuccess: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: hasNonWithdrawnKeys } = useHasNonWithdrawnKeys(nodeOperatorId);
  const navigate = useNavigate();

  return (
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
      notice={
        hasNonWithdrawnKeys ? (
          <DkgRequiredCard onAction={() => void navigate(PATH.IDVTC_DKG)} />
        ) : undefined
      }
    />
  );
};
