import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { FormTitle } from 'shared/components';
import { useClaimIdvtcFormData } from '../context';

export const Info: FC = () => {
  const { isCurrentIcs } = useClaimIdvtcFormData();
  return (
    <>
      <FormTitle>Claim Identified DVT Cluster operator type</FormTitle>
      <Text size="xs">
        {isCurrentIcs
          ? 'You are eligible to claim a new operator type. Choose the option you prefer. Claiming the Identified Community Staker operator type will change some parameters for your node operator according to the section below.'
          : 'You are eligible to claim a new operator type. Claiming the Identified DVT Cluster operator type will change some parameters for your node operator according to the section below.'}
      </Text>
    </>
  );
};
