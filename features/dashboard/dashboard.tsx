import { Block, DataTable, DataTableRow, Divider } from '@lidofinance/lido-ui';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { Section } from 'shared/components';
import {
  useNodeOperatorBalance,
  useNodeOperatorInfo,
  useNodeOperatorSummary,
} from 'shared/hooks';

export const Dashboard: FC = () => {
  const id = useNodeOperatorId();
  const { data: info } = useNodeOperatorInfo(id);
  const { data: balance } = useNodeOperatorBalance(id);
  const { data: summary } = useNodeOperatorSummary(id);

  return (
    <>
      <Section title="Bond Balance">
        <Block>
          <DataTable>
            {balance &&
              Object.entries(balance).map(([key, value]) => {
                if (key.match(/^[0-9]/)) return null;
                return (
                  <DataTableRow key={key} title={key}>
                    {value?.toString()}
                  </DataTableRow>
                );
              })}
          </DataTable>
        </Block>
      </Section>
      <Divider />
      <Section title="Keys summary">
        <Block>
          <DataTable>
            {summary &&
              Object.entries(summary).map(([key, value]) => {
                if (key.match(/^[0-9]/)) return null;
                return (
                  <DataTableRow key={key} title={key}>
                    {value?.toString()}
                  </DataTableRow>
                );
              })}
          </DataTable>
        </Block>
      </Section>
      <Divider />
      <Section title="NodeOperator Info">
        <Block>
          <DataTable>
            {info &&
              Object.entries(info).map(([key, value]) => {
                if (key.match(/^[0-9]/)) return null;
                return (
                  <DataTableRow key={key} title={key}>
                    {value?.toString()}
                  </DataTableRow>
                );
              })}
          </DataTable>
        </Block>
      </Section>
    </>
  );
};
