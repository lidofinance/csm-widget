import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useNodeOperator } from 'providers/node-operator-provider';
import { FC } from 'react';

export const Dashboard: FC = () => {
  const { details } = useNodeOperator();

  return (
    <DataTable>
      {details &&
        Object.entries(details).map(([key, value]) => {
          if (key.match(/^[0-9]/)) return null;
          return (
            <DataTableRow key={key} title={key}>
              {value?.toString()}
            </DataTableRow>
          );
        })}
    </DataTable>
  );
};
