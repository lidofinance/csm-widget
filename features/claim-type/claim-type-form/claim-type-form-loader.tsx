import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useClaimTypeFormData, useClaimTypeFlow } from './context';
import { Info } from './controls/info';
import { ClaimTypeSuccess } from './claim-type-success';

const EMPTY_STATE: Record<string, React.ReactNode> = {
  paused: <>ICS claiming is currently paused</>,
  claimed: <>You have already claimed the ICS operator type</>,
  'not-eligible': <>You are not eligible to claim the ICS operator type</>,
};

export const ClaimTypeFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { justClaimed } = useClaimTypeFormData();
  const flow = useClaimTypeFlow();

  if (justClaimed) {
    return <ClaimTypeSuccess />;
  }

  return (
    <FormLoader empty={EMPTY_STATE[flow.action]}>
      {flow.action === 'no-access' ? <Info /> : children}
    </FormLoader>
  );
};
