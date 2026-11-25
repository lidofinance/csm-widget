import { FC } from 'react';
import { useShowFlags } from 'shared/hooks';
import { OperatorTypeSection } from 'shared/node-operator';

export const OperatorTypeHubSection: FC = () => {
  const { IS_CSM_FAMILY, CAN_CLAIM_ICS, CAN_CLAIM_IDVTC, ICS_APPLY_ENABLED } =
    useShowFlags();

  if (
    !IS_CSM_FAMILY ||
    !(CAN_CLAIM_ICS || CAN_CLAIM_IDVTC || ICS_APPLY_ENABLED)
  ) {
    return null;
  }

  return <OperatorTypeSection />;
};
