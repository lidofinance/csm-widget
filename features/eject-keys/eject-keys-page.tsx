import { FC } from 'react';

import { Layout } from 'shared/layout';
import {
  DeleteKeysSwitcher,
  DeleteKeysSwitcherRoutes,
  KeysPageSwitcher,
} from 'shared/navigate';
import { EjectKeys } from './eject-keys';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Faq, FormBlock } from 'shared/components';
import { FAQ_KEYS } from 'faq';

export const EjectKeysPage: FC = () => (
  <Layout
    title="Delete validator keys"
    subtitle="Remove or eject your validator keys"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageEjectKeys}
  >
    <KeysPageSwitcher />
    <FormBlock>
      <DeleteKeysSwitcher active={DeleteKeysSwitcherRoutes.EJECT} />
      <EjectKeys />
    </FormBlock>
    <Faq items={FAQ_KEYS} />
  </Layout>
);
