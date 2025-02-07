import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { SectionBlock, Stack } from 'shared/components';
import { AvailableToClaim } from './available-to-claim';
import { BondBalance } from './bond-balance';
import { LastRewards } from './last-rewards';

export const BondSection: FC = () => {
  return (
    <SectionBlock
      title="Bond & Rewards"
      href={PATH.BOND}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardBondLink}
    >
      <Stack direction="column" gap="md">
        <AvailableToClaim />
        <BondBalance />
        <LastRewards />
      </Stack>
    </SectionBlock>
  );
};
