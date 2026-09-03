import {
  MODULE_NAME,
  OPERATOR_TYPE,
  OPERATOR_TYPE_MODULE,
} from '@lidofinance/lido-csm-sdk';
import { InlineLoader, Text } from '@lidofinance/lido-ui';
import { OPERATOR_TYPE_METADATA } from 'consts';
import { useCurveParameters } from 'modules/web3';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { useParameters } from 'shared/components/parameters-list/parameters';
import { ParameterRowStyle } from './styles';

export const Parameters: FC<{ curveId: bigint; type: OPERATOR_TYPE }> = ({
  curveId,
  type,
}) => {
  const metadata = OPERATOR_TYPE_METADATA[type];
  const targetModule = OPERATOR_TYPE_MODULE[type] ?? MODULE_NAME.CSM;
  const wcType = targetModule === MODULE_NAME.CSM_02 ? '0x02' : '0x01';
  const { data: parameters } = useCurveParameters(
    curveId,
    undefined,
    targetModule,
  );
  const PARAMETERS = useParameters().filter((p) => p.renderRows);

  return (
    <Stack direction="column" gap="sm">
      {PARAMETERS.map(({ title: paramTitle, renderRows }) => (
        <Stack direction="column" key={paramTitle} gap="xs">
          <Text size="xxs" weight={700}>
            {paramTitle}:
          </Text>
          {parameters ? (
            renderRows?.(parameters).map(({ label, value }) => (
              <ParameterRowStyle key={label}>
                <Text size="xxs" color="secondary">
                  {label}
                </Text>
                <Text size="xxs" weight={700}>
                  {value}
                </Text>
              </ParameterRowStyle>
            ))
          ) : (
            <InlineLoader />
          )}
        </Stack>
      ))}
      {metadata.capitalMultiplier && (
        <ParameterRowStyle>
          <Text size="xxs" weight={700}>
            Capital multiplier
          </Text>
          <Text size="xxs" weight={700}>
            {metadata.capitalMultiplier}
          </Text>
        </ParameterRowStyle>
      )}
      <ParameterRowStyle>
        <Text size="xxs" weight={700}>
          Withdrawal credential type
        </Text>
        <Text size="xxs" weight={700}>
          {wcType}
        </Text>
      </ParameterRowStyle>
    </Stack>
  );
};
