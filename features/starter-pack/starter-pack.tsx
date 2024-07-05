import { Button } from '@lidofinance/lido-ui';
import { KEYS_PATH } from 'consts/urls';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Faq } from 'shared/components';
import { useCsmEarlyAdoption } from 'shared/hooks';
import { useCsmStatus } from 'shared/hooks/useCsmStatus';
import { ConsumedBanner } from './consumed-banner';
import { NotEligibleBanner } from './not-eligible-banner/not-eligible-banner';
import { PausedBanner } from './paused-banner';
import { StarterPackSection } from './stacter-pack-section';

export const StarterPack: FC = () => {
  const router = useRouter();

  const { data } = useCsmStatus();

  const {
    data: { proof, consumed },
  } = useCsmEarlyAdoption();

  if (data?.isPaused) {
    return <PausedBanner />;
  }

  if (data?.isEarlyAdoption && consumed) {
    return <ConsumedBanner />;
  }

  if (data?.isEarlyAdoption && !proof) {
    return <NotEligibleBanner />;
  }

  return (
    <>
      <StarterPackSection>
        <Button onClick={() => router.push(KEYS_PATH)}>
          Create Node Operator
        </Button>
      </StarterPackSection>
      <Faq />
    </>
  );
};
