import { CurveRef } from '@lidofinance/lido-csm-sdk';
import { Body, DataListRow, Skeleton, Stack } from '@lidofinance/lido-app-ui';
import { CUSTOM_CURVE, OPERATOR_TYPE_METADATA } from 'consts';
import { useCurveParameters } from 'modules/web3';
import { FC, useMemo } from 'react';
import {
  formatEthKeyIntervalRows,
  formatPercentKeyIntervalRows,
  ParameterRow,
} from 'shared/components/parameters-list/format';
import {
  OptionCardsField,
  OptionCardsFieldOption,
} from 'shared/hook-form/fields';
import { useCurveMetadataGetter } from 'shared/hooks';
import { CurveBadge } from 'shared/node-operator';
import { useCuratedOperatorFormData } from '../context';
import { getGateCardTestId } from '../curated-operator-wizard';
import { CompactListStyle, GateParamsStyle } from './styles';

type ParamGroupProps = {
  title: string;
  rows?: ParameterRow[];
  'data-testid': string;
};

const ParamGroup: FC<ParamGroupProps> = ({
  title,
  rows,
  'data-testid': testId,
}) => (
  <Stack gap={8} data-testid={testId}>
    <Body as="p" weight="semibold">
      {title}
    </Body>
    {rows ? (
      <CompactListStyle>
        {rows.map(({ label, value }, index) => (
          <DataListRow key={`${label}-${index}`} label={label} value={value} />
        ))}
      </CompactListStyle>
    ) : (
      <Skeleton variant="text" lines={2} />
    )}
  </Stack>
);

const GateCardParams: FC<{ curve: CurveRef }> = ({ curve }) => {
  const { data: parameters } = useCurveParameters(curve);

  return (
    <GateParamsStyle minItemWidth={200} rowGap={16} columnGap={24}>
      <ParamGroup
        title="Node Operator reward:"
        rows={
          parameters && formatPercentKeyIntervalRows(parameters.rewardsConfig)
        }
        data-testid="gateCardRewardParams"
      />
      <ParamGroup
        title="Bond:"
        rows={parameters && formatEthKeyIntervalRows(parameters.bondConfig)}
        data-testid="gateCardBondParams"
      />
    </GateParamsStyle>
  );
};

export const GateSelector: FC = () => {
  const { availableGates = [] } = useCuratedOperatorFormData();
  const getCurveMetadata = useCurveMetadataGetter();

  const options = useMemo(
    () =>
      availableGates.map((gate): OptionCardsFieldOption => {
        const metadata =
          getCurveMetadata(gate.curve) ?? OPERATOR_TYPE_METADATA[CUSTOM_CURVE];

        return {
          value: gate.gateName,
          title: <span data-testid="gateCardTitle">{metadata.name}</span>,
          description: (
            <span data-testid="gateCardDescription">
              {metadata.description}
            </span>
          ),
          tags: <CurveBadge curve={gate.curve} inline />,
          children: <GateCardParams curve={gate.curve} />,
          'data-testid': getGateCardTestId(metadata.short),
        };
      }),
    [availableGates, getCurveMetadata],
  );

  return (
    <OptionCardsField
      name="gateName"
      aria-label="Sub-Node Operator type"
      options={options}
      showUntouched
      data-testid="gateSelector"
    />
  );
};
