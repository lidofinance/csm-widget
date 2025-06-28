import { FC } from 'react';

import { Layout } from 'shared/layout';
import {
  DeleteKeysSwitcher,
  DeleteKeysSwitcherRoutes,
  KeysPageSwitcher,
} from 'shared/navigate';
import { RemoveKeys } from './remove-keys';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Faq, FormBlock } from 'shared/components';
import { FAQ_KEYS } from 'faq';

export const RemoveKeysPage: FC = () => (
  <Layout
    title="Delete validator keys"
    subtitle="Remove or eject your validator keys"
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.pageRemoveKeys}
  >
    <KeysPageSwitcher />
    <FormBlock>
      <DeleteKeysSwitcher active={DeleteKeysSwitcherRoutes.REMOVE} />
      <RemoveKeys />
    </FormBlock>
    <Faq items={FAQ_KEYS} />
  </Layout>
);
