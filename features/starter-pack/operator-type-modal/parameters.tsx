import { Text } from '@lidofinance/lido-ui';
import { useCurveParameters } from 'modules/web3';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { PARAMETERS } from 'shared/components/parameters-list/parameters';
import { ParametersValue } from 'shared/components/parameters-list/parameters-value';

export const Parameters: FC<{ curveId: bigint }> = ({ curveId }) => {
  const { data: parameters } = useCurveParameters(curveId);

  return (
    <Stack direction="column">
      <Text size="sm" weight={700}>
        Parameters
      </Text>
      {PARAMETERS.slice(0, 2).map(({ title: paramTitle, render }) => {
        const values = render(parameters);
        return (
          <Stack direction="column" key={paramTitle} gap="xs">
            <Text size="xxs" weight={700}>
              {paramTitle}:
            </Text>
            <ParametersValue values={values} loading={!parameters} size="xxs" />
          </Stack>
        );
      })}
    </Stack>
  );
};
