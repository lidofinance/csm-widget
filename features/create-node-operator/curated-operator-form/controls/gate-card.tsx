import { Check, Divider, InlineLoader, Text } from '@lidofinance/lido-ui';
import { type ChangeEvent, type FC, type ReactNode } from 'react';
import { useCurveParameters } from 'modules/web3';
import {
  formatPercentKeyIntervals,
  formatEthKeyIntervals,
} from 'shared/components/parameters-list/format';
import { RadioButton, Stack } from 'shared/components';
import { CurveBadge } from 'shared/node-operator/curve-badge/curve-badge';
import styled from 'styled-components';
import { getCurveMetadata, getModuleOperatorType } from 'consts';

type GateCardProps = {
  curveId: bigint;
  checked: boolean;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
};

export const GateCard: FC<GateCardProps> = ({ curveId, ...fieldProps }) => {
  const { data: parameters } = useCurveParameters(curveId);

  const metadata = getCurveMetadata(curveId);
  const operatorType = getModuleOperatorType(curveId);
  const loading = !parameters;

  return (
    <RadioButton
      small
      {...fieldProps}
      data-testid={`gateCard${metadata.short}`}
    >
      <Stack gap="xs">
        <CardLayout>
          <Stack direction="column" gap="sm">
            <CurveBadge
              data-testid={`gateCardBadge`}
              type={operatorType}
              inline
            />
            <Text size="xs" weight={700} data-testid={`gateCardTitle`}>
              {metadata.name}
            </Text>
            {metadata.description && (
              <Description
                color="secondary"
                size="xxs"
                data-testid={`gateCardDescription`}
              >
                {metadata.description}
              </Description>
            )}
          </Stack>
          <Divider type="vertical" />
          <Stack direction="column" gap="md">
            <ParamSection
              title="Node Operator reward:"
              loading={loading}
              items={formatPercentKeyIntervals(parameters?.rewardsConfig)}
              data-testid={`gateCardRewardParams`}
            />
            <ParamSection
              title="Bond:"
              loading={loading}
              items={formatEthKeyIntervals(parameters?.bondConfig)}
              data-testid={`gateCardBondParams`}
            />
          </Stack>
        </CardLayout>
        <SatusStyled>
          {fieldProps.checked && (
            <CheckIcon data-testid={`gateCardCheckIcon`} />
          )}
        </SatusStyled>
      </Stack>
    </RadioButton>
  );
};

const ParamSection: FC<{
  title: string;
  items: ReactNode[];
  loading?: boolean;
}> = ({ title, items, loading, ...props }) => (
  <div {...props}>
    <Text size="xxs" weight={700}>
      {title}
    </Text>
    {loading ? (
      <InlineLoader />
    ) : (
      <ParamList>
        {items.map((item, i) => (
          <li key={i}>
            <Text size="xxs" color="secondary">
              {item}
            </Text>
          </li>
        ))}
      </ParamList>
    )}
  </div>
);

const CardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 20px;
  width: 100%;
`;

const Description = styled(Text)`
  line-height: 1.4;
`;

const ParamList = styled.ul`
  margin: 4px 0 0;
  padding-left: 16px;
  list-style: disc;

  li {
    margin-bottom: 2px;
  }
`;

const SatusStyled = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  width: 24px;
`;

const CheckIcon = styled(Check)`
  border-radius: 100%;
  background: var(--lido-color-primary);
  color: var(--lido-color-primaryContrast);
`;
