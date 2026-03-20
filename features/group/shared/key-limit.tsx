import { NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { pluralKeys } from 'utils';

type Props = {
  info: NodeOperatorInfo | undefined;
};

export const KeyLimit: FC<Props> = ({ info }) => {
  if (!info?.targetLimit) return null;

  const keys = info.totalAddedKeys - info.totalWithdrawnKeys;
  const limitText = pluralKeys({ value: keys, showValue: true });

  return (
    <Text color="secondary" size="xxs">
      {info.targetLimit <= keys ? (
        <>Key limit of {limitText} has been reached</>
      ) : (
        <>Key limit to this Node Operator is set to {limitText}</>
      )}
    </Text>
  );
};
