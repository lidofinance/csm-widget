import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';

import { ClaimIdvtcForm } from './claim-idvtc-form';

export const ClaimIdvtc = () => {
  const key = useWeb3Key();
  return (
    <NoSSRWrapper>
      <ClaimIdvtcForm key={key} />
    </NoSSRWrapper>
  );
};
