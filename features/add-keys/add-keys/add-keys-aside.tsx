import { DataListRow } from '@lidofinance/lido-app-ui';
import { DATA_UNAVAILABLE } from 'consts/text';
import { useModule } from 'modules/web3';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { GasCostRow, SubmitAside } from 'shared/form-page';
import { AddKeysFormInputType, useAddKeysFormData } from './context';
import { BondDeltaAsideRow } from './controls/bond-delta';
import { KeysConfirm } from './controls/keys-confirm';
import { KeysSubmitButton } from './controls/submit-button';

const AsideRows: FC = () => {
  const { isCsmFamily } = useModule();
  const depositData = useWatch<AddKeysFormInputType, 'depositData'>({
    name: 'depositData',
  });
  const { shareLimit } = useAddKeysFormData(true);

  return (
    <>
      <BondDeltaAsideRow />
      <DataListRow label="Number of keys" value={depositData?.length ?? 0} />
      <GasCostRow />
      {isCsmFamily && (
        <DataListRow
          label="Deposit queue"
          info="The number of validators in the CSM deposit queue at the moment"
          value={shareLimit?.queue.toString() ?? DATA_UNAVAILABLE}
        />
      )}
    </>
  );
};

export const AddKeysAside: FC = () => (
  <SubmitAside confirm={<KeysConfirm />} rows={<AsideRows />}>
    <KeysSubmitButton />
  </SubmitAside>
);
