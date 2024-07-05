import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { Latice, TitledAddress, Warning } from 'shared/components';
import { useNodeOperatorInfo } from 'shared/hooks';

export const Info: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data } = useNodeOperatorInfo(nodeOperatorId);

  return (
    <>
      <Latice variant="secondary">
        <TitledAddress
          title={`Current rewards address`}
          address={data?.rewardAddress}
        />
        <TitledAddress
          title={<Warning text="Pending change" />}
          address={data?.proposedRewardAddress}
        />
      </Latice>
    </>
  );
};
