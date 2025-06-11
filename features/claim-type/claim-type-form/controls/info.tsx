import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { FormTitle } from 'shared/components';

export const Info: FC = () => {
  return (
    <>
      <FormTitle>Claim Identified Community Staker operator type</FormTitle>
      <Text size="xs">
        You are eligible to claim a new operator type. Claiming the Identified
        Community Staker operator type will change some parameters for your node
        operator according to the section below.
      </Text>
    </>
  );
};
