import {
  MODULE_NAME,
  OPERATOR_TYPE,
  OPERATOR_TYPE_INFO,
} from '@lidofinance/lido-csm-sdk';
import { Skeleton } from '@lidofinance/lido-app-ui';
import { OPERATOR_TYPE_METADATA } from 'consts';
import { useCurveParameters } from 'modules/web3';
import { FC } from 'react';
import { useParameters } from 'shared/components/parameters-list/parameters';
import { useOperatorTypeCurve } from 'shared/hooks';
import {
  ParameterGroupStyle,
  ParameterRowStyle,
  ParametersStyle,
  ParameterTitleStyle,
} from './styles';

export const Parameters: FC<{ type: OPERATOR_TYPE }> = ({ type }) => {
  const metadata = OPERATOR_TYPE_METADATA[type];
  const wcType =
    OPERATOR_TYPE_INFO[type].module === MODULE_NAME.CSM_02 ? '0x02' : '0x01';
  const { data: parameters } = useCurveParameters(useOperatorTypeCurve(type));
  const PARAMETERS = useParameters(OPERATOR_TYPE_INFO[type].module).filter(
    (p) => p.renderRows,
  );

  return (
    <ParametersStyle>
      {PARAMETERS.map(({ title, renderRows }) => (
        <ParameterGroupStyle key={title}>
          <ParameterTitleStyle>{title}:</ParameterTitleStyle>
          {parameters ? (
            renderRows?.(parameters).map(({ label, value }) => (
              <ParameterRowStyle key={label}>
                <span>{label}</span>
                <span>{value}</span>
              </ParameterRowStyle>
            ))
          ) : (
            <Skeleton variant="text" />
          )}
        </ParameterGroupStyle>
      ))}
      {metadata.capitalMultiplier && (
        <ParameterRowStyle $strong>
          <span>Capital multiplier</span>
          <span>{metadata.capitalMultiplier}</span>
        </ParameterRowStyle>
      )}
      <ParameterRowStyle $strong>
        <span>Withdrawal credential type</span>
        <span>{wcType}</span>
      </ParameterRowStyle>
    </ParametersStyle>
  );
};
