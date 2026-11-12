import { DataList, DataListRow } from '@lidofinance/lido-app-ui';
import { DATA_UNAVAILABLE } from 'consts/text';
import { FC } from 'react';
import { useGasCost } from './use-gas-cost';

export const GAS_COST_INFO =
  'Estimated maximum network fee for this transaction';

export const GasCostRow: FC = () => {
  const { value } = useGasCost();

  return (
    <DataListRow
      label="Total gas cost"
      info={GAS_COST_INFO}
      value={value ?? DATA_UNAVAILABLE}
      dataTestId={{ root: 'gasCostRow' }}
    />
  );
};

export const GasCostList: FC = () => (
  <DataList divided>
    <GasCostRow />
  </DataList>
);
