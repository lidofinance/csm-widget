import { DataListRow } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { SubmitKeysFormInputType, useSubmitKeysFormData } from './context';

export const SubmitKeysFormInfo: FC = () => {
  const depositData = useWatch<SubmitKeysFormInputType, 'depositData'>({
    name: 'depositData',
  });
  const { shareLimit } = useSubmitKeysFormData(true);

  return (
    <>
      <DataListRow label="Number of keys" value={depositData.length} />
      <DataListRow
        label="Deposit queue"
        info="The number of validators in the CSM deposit queue at the moment"
        value={shareLimit?.queue?.toString()}
      />
    </>
  );
};
