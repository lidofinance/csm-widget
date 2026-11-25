import { Typography } from '@lidofinance/lido-app-ui';
import { NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { pluralKeys } from 'utils';

export const KeyLimitNote: FC<{ info: NodeOperatorInfo | undefined }> = ({
  info,
}) => {
  if (!info?.targetLimit) return null;

  const limitText = pluralKeys({ value: info.targetLimit, showValue: true });

  return (
    <Typography
      variant="description"
      color="tertiary"
      dataTestId={{ root: 'operatorKeyLimit' }}
    >
      {info.targetLimit <= info.totalDepositedKeys ? (
        <>Key limit of {limitText} has been reached</>
      ) : (
        <>Key limit to this Node Operator is set to {limitText}</>
      )}
    </Typography>
  );
};
