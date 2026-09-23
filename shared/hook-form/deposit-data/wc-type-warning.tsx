import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { WarningBlock } from 'shared/components';
import { LocalLink } from 'shared/navigate';
import { useMyOperators } from 'shared/hooks/use-my-operators';
import { DepositDataInputType } from './use-parse-deposit-data';

const has0x01WithdrawalCredentials = (
  depositData: DepositDataInputType['depositData'],
) =>
  depositData.some((item) =>
    item.withdrawal_credentials
      .toLowerCase()
      .replace(/^0x/, '')
      .startsWith('01'),
  );

// A 0x01 key doesn't unlock CSM 0x02's larger validator balances.
export const useIsWcTypeMismatch = (module?: MODULE_NAME) => {
  const [depositData] = useWatch<DepositDataInputType, ['depositData']>({
    name: ['depositData'],
  });

  return (
    module === MODULE_NAME.CSM_02 && has0x01WithdrawalCredentials(depositData)
  );
};

export const WcTypeWarning: FC = () => {
  const { data: myOperators } = useMyOperators();
  const has0x01Operator = myOperators?.some(
    (op) => op.module === MODULE_NAME.CSM,
  );
  const csm0x01Path = has0x01Operator ? PATH.MY_OPERATORS : PATH.CREATE_0x01;

  return (
    <WarningBlock data-testid="wcTypeWarning">
      The submitted key is 0x01. If you plan to use 0x02, please generate it
      correctly or upload the key to{' '}
      <LocalLink href={csm0x01Path}>CSM 0x01</LocalLink>.
    </WarningBlock>
  );
};
