import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Button } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { FC, PropsWithChildren } from 'react';
import { EmptyState } from 'shared/components';
import { FormLoader } from 'shared/hook-form/form-controller';
import { getOperatorTypeQuery } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import { ClaimIdvtcSuccess } from './claim-idvtc-success';
import { useClaimIdvtcFlow, useClaimIdvtcFormData } from './context';
import { ClaimedWithProofInfo } from './controls/claimed-with-proof-info';
import { Info } from './controls/info';
import { Parameters } from './controls/parameters';

const EMPTY_STATE: Record<string, React.ReactNode> = {
  paused: <>IDVTC claiming is currently paused</>,
  claimed: <>You have already claimed the IDVTC operator type</>,
  'not-eligible': <>You are not eligible to claim the IDVTC operator type</>,
};

const ClaimIdvtcFormGate: FC<PropsWithChildren> = ({ children }) => {
  const { justClaimed } = useClaimIdvtcFormData();
  const flow = useClaimIdvtcFlow();

  if (justClaimed) return <ClaimIdvtcSuccess />;
  if (flow.action === 'no-access') return <Info />;
  if (flow.action === 'claimed-with-proof') {
    return (
      <>
        <ClaimedWithProofInfo />
        <Parameters />
        <LocalLink
          href={PATH.CREATE}
          query={getOperatorTypeQuery(OPERATOR_TYPE.CSM_IDVTC)}
        >
          <Button fullwidth>Create IDVTC operator</Button>
        </LocalLink>
      </>
    );
  }

  const empty = EMPTY_STATE[flow.action];
  if (empty) return <EmptyState>{empty}</EmptyState>;

  return <>{children}</>;
};

export const ClaimIdvtcFormLoader: FC<PropsWithChildren> = ({ children }) => (
  <FormLoader>
    <ClaimIdvtcFormGate>{children}</ClaimIdvtcFormGate>
  </FormLoader>
);
