import { DataListRow } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { SubmitAside, SubmitButton } from 'shared/form-page';
import { FormatToken } from 'shared/formatters';
import { EjectKeysFormInputType } from './context';
import {
  EJECTION_COST_TOOLTIP,
  EJECTION_REFUND_TOOLTIP,
} from './eject-keys-state';

const AsideRows: FC = () => {
  const [selection, feeAmount] = useWatch<
    EjectKeysFormInputType,
    ['selection', 'feeAmount']
  >({ name: ['selection', 'feeAmount'] });

  return (
    <>
      <DataListRow
        label="Ejection cost"
        info={EJECTION_COST_TOOLTIP}
        value={<FormatToken amount={feeAmount ?? 0n} token={TOKENS.eth} />}
        description="Will be deducted from your wallet balance"
        descriptionInfo={EJECTION_REFUND_TOOLTIP}
        dataTestId={{ root: 'ejectionCost', value: 'ejectionCostValue' }}
      />
      <DataListRow
        label="Number of keys to eject"
        value={selection?.length ?? 0}
        dataTestId={{
          root: 'numbersOfKeysToEject',
          value: 'numbersOfKeysToEjectValue',
        }}
      />
    </>
  );
};

export const EjectKeysAside: FC = () => (
  <SubmitAside rows={<AsideRows />}>
    <SubmitButton data-testid="ejectKeysButton">Eject Keys</SubmitButton>
  </SubmitAside>
);
