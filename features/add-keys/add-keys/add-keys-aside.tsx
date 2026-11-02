import { DataListRow } from '@lidofinance/lido-app-ui';
import { DATA_UNAVAILABLE } from 'consts/text';
import { useModule } from 'modules/web3';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { SubmitAside } from 'shared/form-page';
import { AddKeysFormInputType, useAddKeysFormData } from './context';
import { InsufficientBondRow } from './controls/bond-delta';
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
      <InsufficientBondRow />
      <DataListRow label="Number of keys" value={depositData?.length ?? 0} />
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
