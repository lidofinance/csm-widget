import { FC } from 'react';

import { Layout } from 'shared/layout';
import { KeysPageSwitcher } from 'shared/navigate';
import { AddKeys } from './add-keys';
import { useNodeOperatorId, useOperatorInfo } from 'modules/web3';

export const AddKeysPage: FC = () => (
  <Layout
    wide
    title="Submit validator keys"
    subtitle={<Subtitle />}
    pageName="AddKeys"
  >
    <KeysPageSwitcher />
    <AddKeys />
  </Layout>
);

const Subtitle: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo({ nodeOperatorId });

  if (info?.totalAddedKeys === 0) {
    return <>Upload new keys</>;
  }

  return <>Upload more keys</>;
};
