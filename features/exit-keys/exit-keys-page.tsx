import { FC } from 'react';

import { Layout } from 'shared/layout';
import {
  DeleteKeysSwitcher,
  DeleteKeysSwitcherRoutes,
  KeysPageSwitcher,
} from 'shared/navigate';
import { ExitKeys } from './exit-keys';
import { Faq, FormBlock } from 'shared/components';
import { FAQ_KEYS } from 'faq';

export const ExitKeysPage: FC = () => (
  <Layout
    title="Delete validator keys"
    subtitle="Remove or eject your validator keys"
    pageName="ExitKeys"
  >
    <KeysPageSwitcher />
    <FormBlock>
      <DeleteKeysSwitcher active={DeleteKeysSwitcherRoutes.EXIT} />
      <ExitKeys />
    </FormBlock>
    <Faq items={FAQ_KEYS} />
  </Layout>
);
