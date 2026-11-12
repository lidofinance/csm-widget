import { DataList, DataListRow } from '@lidofinance/lido-app-ui';
import { DATA_UNAVAILABLE } from 'consts/text';
import { FC } from 'react';
import { useGasCost } from './use-gas-cost';

export const GAS_COST_INFO =
  'Estimated maximum network fee for this transaction';

type GasCostProps = { intent?: string };

export const GasCostRow: FC<GasCostProps> = ({ intent }) => {
  const { value } = useGasCost(intent);

  return (
    <DataListRow
      label="Total gas cost"
      info={GAS_COST_INFO}
      value={value ?? DATA_UNAVAILABLE}
      dataTestId={{ root: 'gasCostRow' }}
    />
  );
};

export const GasCostList: FC<GasCostProps> = ({ intent }) => (
  <DataList divided>
    <GasCostRow intent={intent} />
  </DataList>
);
