import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { useModule } from 'modules/web3';
import { FC } from 'react';
import { SectionBlock, Stack } from 'shared/components';
import { CsmKeys } from './csm-keys';
import { KeysBreakdown } from './keys-breakdown/keys-breakdown';
import { NoGroupBanner } from './no-group-banner';
import { StakeAndKeys } from './stake-and-keys';
import { Divider } from '@lidofinance/lido-ui';

export const KeysSection: FC = () => {
  const { isCM } = useModule();

  return (
    <>
      <NoGroupBanner />
      <SectionBlock
        title={isCM ? 'Stake & Keys' : 'Keys'}
        data-testid="dashboardKeysSection"
        href={PATH.KEYS}
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardKeysLink}
      >
        <Stack direction="column" gap="sm">
          {isCM ? <StakeAndKeys /> : <CsmKeys />}
          <Divider />
          <KeysBreakdown />
        </Stack>
      </SectionBlock>
    </>
  );
};
