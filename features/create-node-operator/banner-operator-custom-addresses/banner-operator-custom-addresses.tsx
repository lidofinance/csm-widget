import { MessageBox } from '@lidofinance/lido-app-ui';
import { MODULE_METADATA } from 'consts/module';
import { FC } from 'react';
import { DescriptorId } from 'shared/node-operator';
import { useOperatorCustomAddresses } from './use-operator-custom-addresses';

export const BannerOperatorCustomAddresses: FC = () => {
  const [operator] = useOperatorCustomAddresses();

  if (!operator) {
    return null;
  }

  return (
    <MessageBox
      variant="warning"
      headline="You have created a Node Operator with custom addresses"
    >
      To continue, connect to {MODULE_METADATA[operator.module].shortTitle} UI
      with the address you specified as Reward/Manager Address for{' '}
      <DescriptorId id={operator.nodeOperatorId} /> or create a new Node
      Operator using the currently connected address
    </MessageBox>
  );
};
