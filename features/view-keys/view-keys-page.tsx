import { FC } from 'react';

import { Layout } from 'shared/layout';
import { KeysPageSwitcher } from 'shared/navigate';
import { ViewKeys } from './view-keys';
import { Faq } from 'shared/components';
import { FAQ_KEYS } from 'faq';

export const ViewKeysPage: FC = () => (
  <Layout
    title="View keys list"
    subtitle="Check the list of your keys"
    pageName="ViewKeys"
  >
    <KeysPageSwitcher />
    <ViewKeys />
    <Faq items={FAQ_KEYS} />
  </Layout>
);
