import { FC } from 'react';
import { Banner } from 'shared/components';
import { DescriptorId } from 'shared/node-operator';
import { useOperatorCustomAddresses } from './use-operator-custom-addresses';

export const BannerOperatorCustomAddresses: FC = () => {
  const [nodeOperatorId] = useOperatorCustomAddresses();

  if (nodeOperatorId === undefined) {
    return null;
  }

  return (
    <Banner
      title="You have created a Node Operator with custom addresses"
      variant="wary"
    >
      To continue, connect to CSM UI with the address you specified as
      Reward/Manager Address for <DescriptorId id={nodeOperatorId} /> or create
      a new Node Operator using the currently connected address.
    </Banner>
  );
};
