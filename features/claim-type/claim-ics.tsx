import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';

import { ClaimIcsForm } from './claim-ics-form';

export const ClaimIcs = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <ClaimIcsForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
