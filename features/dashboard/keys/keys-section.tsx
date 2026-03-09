import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { isModuleCM } from 'consts/module';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { SectionBlock, Stack } from 'shared/components';
import { CsmKeys } from './csm-keys';
import { KeysBreakdown } from './keys-breakdown/keys-breakdown';
import { StakeAndKeys } from './stake-and-keys';

export const KeysSection: FC = () => {
  return (
    <SectionBlock
      title={isModuleCM ? 'Stake and Keys' : 'Keys'}
      data-testid="dashboardKeysSection"
      href={PATH.KEYS_VIEW}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardKeysLink}
    >
      <Stack direction="column" gap="sm">
        {isModuleCM ? <StakeAndKeys /> : <CsmKeys />}
        <KeysBreakdown />
      </Stack>
    </SectionBlock>
  );
};
