import { MODULE_NAME, TOKENS } from '@lidofinance/lido-csm-sdk';
import { Item } from 'features/dashboard/keys/item';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import { KeysBreakdownData } from 'utils';
import { KeysRowStyle } from './styles';

type Props = {
  module: MODULE_NAME;
  keys: KeysBreakdownData | undefined;
  balances: KeysBreakdownData['balances'] | undefined;
};

const eth = (amount: bigint | undefined) => (
  <FormatToken
    amount={amount}
    token={TOKENS.eth}
    maxDecimalDigits={2}
    trimTrailingZeros
    fallback=""
  />
);

export const KeysRow: FC<Props> = ({ module, keys, balances }) => {
  const withBalance = module === MODULE_NAME.CSM_02;
  const counts = keys?.counts;

  return (
    <KeysRowStyle data-testid="operatorKeysRow">
      <Item
        data-testid="keysDepositableCount"
        title="Depositable"
        tooltip="Keys awaiting deposit from the Lido protocol"
        count={counts?.depositable}
        balance={withBalance ? eth(balances?.depositable) : undefined}
      />
      <Item
        data-testid="keysPendingActivationCount"
        title="Pending activation"
        tooltip="Keys have already got deposit from the Lido protocol and waiting to become active"
        count={counts?.activationPending}
        balance={withBalance ? eth(balances?.activationPending) : undefined}
      />
      <Item
        data-testid="keysActiveCount"
        title="Active"
        tooltip="Keys that active"
        count={counts?.active}
        balance={withBalance ? eth(balances?.active) : undefined}
      />
      <Item
        data-testid="keysWithdrawnCount"
        title="Withdrawn"
        tooltip="Keys that have already exited and withdrawn"
        count={
          counts === undefined ? undefined : counts.withdrawn + counts.exited
        }
        balance={withBalance ? eth(balances?.withdrawn) : undefined}
      />
    </KeysRowStyle>
  );
};
