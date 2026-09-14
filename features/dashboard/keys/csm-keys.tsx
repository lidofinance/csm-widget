import {
  KEY_STATUS,
  KeyWithStatus,
  MIN_EFFECTIVE_BALANCE,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import {
  useModule,
  useNodeOperatorId,
  useOperatorKeysWithStatus,
} from 'modules/web3';
import { FC, useCallback } from 'react';
import { FormatToken } from 'shared/formatters';
import { hasStatus, StatusFilter, sumActiveKeysBalance } from 'utils';
import { Item } from './item';
import { Row } from './styles';

// Depositable keys hold no CL balance yet — each is worth its minimum deposit
const minDepositStake = (keys: KeyWithStatus[]) =>
  BigInt(keys.length) * MIN_EFFECTIVE_BALANCE;

export const CsmKeys: FC = () => {
  const id = useNodeOperatorId();
  const { isCSM02 } = useModule();
  const { data: keys } = useOperatorKeysWithStatus(id);

  const stats = useCallback(
    (filter: StatusFilter, sumBalance = sumActiveKeysBalance) => {
      const matched = keys?.filter(hasStatus(filter));
      return {
        count: matched?.length,
        balance: isCSM02 ? (
          <FormatToken
            amount={matched && sumBalance(matched)}
            token={TOKENS.eth}
            maxDecimalDigits={2}
            trimTrailingZeros
            fallback=""
          />
        ) : undefined,
      };
    },
    [keys, isCSM02],
  );

  return (
    <Row>
      <Item
        data-testid="keysDepositableCount"
        title="Depositable"
        tooltip="Keys awaiting deposit from the Lido protocol"
        {...stats(KEY_STATUS.DEPOSITABLE, minDepositStake)}
      />
      <Item
        data-testid="keysPendingActivationCount"
        title="Pending activation"
        tooltip="Keys have already got deposit from the Lido protocol and waiting to become active"
        {...stats(KEY_STATUS.ACTIVATION_PENDING)}
      />
      <Item
        data-testid="keysActiveCount"
        title="Active"
        tooltip="Keys that active"
        {...stats([KEY_STATUS.ACTIVE, KEY_STATUS.EXITING])}
      />
      <Item
        data-testid="keysWithdrawnCount"
        title="Withdrawn"
        tooltip="Keys that have already exited and withdrawn"
        {...stats([KEY_STATUS.WITHDRAWN, KEY_STATUS.WITHDRAWAL_PENDING])}
      />
    </Row>
  );
};
