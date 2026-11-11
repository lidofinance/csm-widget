import { FC } from 'react';

import { PATH } from 'consts/urls';
import { Layout } from 'shared/layout';
import { DeleteKeysSwitcher, DeleteKeysSwitcherRoutes } from 'shared/navigate';
import { ExitKeys } from './exit-keys';
import { Faq, FormBlock } from 'shared/components';
import { useFaq } from 'faq';

export const ExitKeysPage: FC = () => (
  <Layout
    pageName="ExitKeys"
    breadcrumbs={[{ label: 'Keys', href: PATH.KEYS }, { label: 'Delete' }]}
  >
    <FormBlock>
      <DeleteKeysSwitcher active={DeleteKeysSwitcherRoutes.EXIT} />
      <ExitKeys />
    </FormBlock>
    <Faq items={useFaq('KEYS')} />
  </Layout>
);
