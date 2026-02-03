import { Divider, Text } from '@lidofinance/lido-ui';
import { type ChangeEvent, type FC, type ReactNode } from 'react';
import { useCurveParameters } from 'modules/web3';
import {
  formatPercentKeyIntervals,
  formatEthKeyIntervals,
} from 'shared/components/parameters-list/format';
import { RadioButton, Stack } from 'shared/components';
import styled from 'styled-components';
import { getCurveMetadata } from 'consts';

type GateCardProps = {
  curveId: bigint;
  checked: boolean;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
};

// TODO: selected state styles
export const GateCard: FC<GateCardProps> = ({ curveId, ...fieldProps }) => {
  const { data: parameters } = useCurveParameters(curveId);

  const metadata = getCurveMetadata(curveId);

  return (
    <RadioButton small {...fieldProps}>
      <CardLayout>
        <Stack direction="column" gap="sm">
          <Badge>{metadata.short}</Badge>
          <Text size="xs" weight={700}>
            {metadata.name}
          </Text>
          {metadata.description && (
            <Description color="secondary" size="xxs">
              {metadata.description}
            </Description>
          )}
        </Stack>
        <Divider type="vertical" />
        <Stack direction="column" gap="md">
          <ParamSection
            title="Node Operator reward:"
            items={formatPercentKeyIntervals(parameters?.rewardsConfig)}
          />
          <ParamSection
            title="Bond:"
            items={formatEthKeyIntervals(parameters?.bondConfig)}
          />
        </Stack>
      </CardLayout>
    </RadioButton>
  );
};

const ParamSection: FC<{ title: string; items: ReactNode[] }> = ({
  title,
  items,
}) => (
  <div>
    <Text size="xxs" weight={700}>
      {title}
    </Text>
    <ParamList>
      {items.map((item, i) => (
        <li key={i}>
          <Text size="xxs" color="secondary">
            {item}
          </Text>
        </li>
      ))}
    </ParamList>
  </div>
);

const CardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 20px;
  width: 100%;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.28px;
  width: fit-content;
  color: var(--lido-color-secondaryContrast);
  background: var(--lido-color-text);
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
