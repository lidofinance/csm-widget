import {
  MODULE_NAME,
  OPERATOR_TYPE,
  OPERATOR_TYPE_INFO,
} from '@lidofinance/lido-csm-sdk';
import { Description, Skeleton, Stack } from '@lidofinance/lido-app-ui';
import { OPERATOR_TYPE_METADATA } from 'consts';
import { useCurveParameters } from 'modules/web3';
import { FC, ReactNode } from 'react';
import { useParameters } from 'shared/components/parameters-list/parameters';
import { useOperatorTypeCurve } from 'shared/hooks';

type ParameterRowProps = {
  label: ReactNode;
  value: ReactNode;
  strong?: boolean;
};

const ParameterRow: FC<ParameterRowProps> = ({ label, value, strong }) => (
  <Stack direction="row" justify="between" gap={8}>
    <Description
      as="span"
      color={strong ? 'default' : 'secondary'}
      weight={strong ? 'bold' : 'regular'}
    >
      {label}
    </Description>
    <Description as="span" color="default" weight="bold">
      {value}
    </Description>
  </Stack>
);

export const Parameters: FC<{ type: OPERATOR_TYPE }> = ({ type }) => {
  const metadata = OPERATOR_TYPE_METADATA[type];
  const wcType =
    OPERATOR_TYPE_INFO[type].module === MODULE_NAME.CSM_02 ? '0x02' : '0x01';
  const { data: parameters } = useCurveParameters(useOperatorTypeCurve(type));
  const PARAMETERS = useParameters(OPERATOR_TYPE_INFO[type].module).filter(
    (p) => p.renderRows,
  );

  return (
    <Stack gap={8}>
      {PARAMETERS.map(({ title, renderRows }) => (
        <Stack key={title} gap={2}>
          <Description as="span" weight="bold">
            {title}:
          </Description>
          {parameters ? (
            renderRows?.(parameters).map(({ label, value }) => (
              <ParameterRow key={label} label={label} value={value} />
            ))
          ) : (
            <Skeleton variant="text" />
          )}
        </Stack>
      ))}
      {metadata.capitalMultiplier && (
        <ParameterRow
          strong
          label="Capital multiplier"
          value={metadata.capitalMultiplier}
        />
      )}
      <ParameterRow strong label="Withdrawal credential type" value={wcType} />
    </Stack>
  );
};
