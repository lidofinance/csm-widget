import { FC } from 'react';

import { Layout } from 'shared/layout';
import { KeysPageSwitcher } from 'shared/navigate';
import { AddKeys } from './add-keys';
import { Faq } from 'shared/components';
import { FAQ_KEYS } from 'faq';

export const AddKeysPage: FC = () => (
  <Layout
    title="Submit validator keys"
    subtitle="Upload more keys"
    pageName="AddKeys"
  >
    <KeysPageSwitcher />
    <AddKeys />
    <Faq items={FAQ_KEYS} />
  </Layout>
);
