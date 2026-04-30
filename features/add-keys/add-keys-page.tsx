import { FC } from 'react';

import { Layout } from 'shared/layout';
import { KeysPageSwitcher } from 'shared/navigate';
import { AddKeys } from './add-keys';
import { Faq } from 'shared/components';
import { FAQ_KEYS } from 'faq';
import { useNodeOperatorId, useOperatorInfo } from 'modules/web3';

export const AddKeysPage: FC = () => (
  <Layout
    title="Submit validator keys"
    subtitle={<Subtitle />}
    pageName="AddKeys"
  >
    <KeysPageSwitcher />
    <AddKeys />
    <Faq items={FAQ_KEYS} />
  </Layout>
);

const Subtitle: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo(nodeOperatorId);

  if (info?.totalAddedKeys === 0) {
    return <>Upload new keys</>;
  }

  return <>Upload more keys</>;
};
