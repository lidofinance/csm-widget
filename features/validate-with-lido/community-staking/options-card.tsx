import { Divider, H3, Stack, Typography } from '@lidofinance/lido-app-ui';
import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FC, Fragment } from 'react';
import styled from 'styled-components';
import { DisclaimerMark } from 'shared/components';
import { TypeBadge } from 'shared/node-operator/type-badge';
import { useModuleOpen } from 'shared/hooks/can-create/use-module-open';
import { ModuleStatusTag, PromoCard } from '../components';
import { isStatVisible, StatBody } from './stat-body';
import { AprType, Stat } from './use-csm-stats';

type Option = {
  type: AprType;
  name: string;
  description: string;
};

const OPTIONS: Option[] = [
  {
    type: OPERATOR_TYPE.CSM_DEF,
    name: 'Default',
    description: 'The simplest way to start validating in CSM',
  },
  {
    type: OPERATOR_TYPE.CSM_ICS,
    name: 'ICS',
    description: 'Get verified and unlock better parameters',
  },
  {
    type: OPERATOR_TYPE.CSM_IDVTC,
    name: 'IDVTC',
    description: 'Join a cluster of solo stakers to get better parameters',
  },
  {
    type: OPERATOR_TYPE.CSM2_DEF,
    name: '0x02',
    description: 'Validate up to 2,048 ETH per key for enhanced economics',
  },
];

const AprColumn = styled.div`
  flex: none;
  width: 60px;
  text-align: right;
`;

const ComingSoonTag: FC = () => {
  const { isOpen, isPending } = useModuleOpen(MODULE_NAME.CSM_02);
  return isOpen || isPending ? null : <ModuleStatusTag variant="coming-soon" />;
};

type OptionRowProps = { option: Option; apr: Stat<number> };

const OptionRow: FC<OptionRowProps> = ({ option, apr }) => (
  <Stack direction="row" align="center" gap={12}>
    <TypeBadge type={option.type} size={52} />
    <Stack grow direction="column" gap={4}>
      <Stack direction="row" gap={8} align="center">
        <Typography variant="bodyLarge" weight="semibold">
          {option.name}
        </Typography>
        {option.type === OPERATOR_TYPE.CSM2_DEF && <ComingSoonTag />}
      </Stack>
      <Typography variant="description" color="secondary">
        {option.description}
      </Typography>
    </Stack>
    {isStatVisible(apr) && (
      <AprColumn>
        <Typography variant="description" color="secondary">
          APY up to
        </Typography>
        <StatBody
          stat={apr}
          format={(value) => (
            <Typography variant="bodyLarge" weight="semibold">
              {value}%<DisclaimerMark id="apr" />
            </Typography>
          )}
        />
      </AprColumn>
    )}
  </Stack>
);

type OptionsCardProps = { aprs: Record<AprType, Stat<number>> };

export const OptionsCard: FC<OptionsCardProps> = ({ aprs }) => (
  <PromoCard>
    <Stack direction="column" gap={24} align="stretch">
      <H3>Your Options to Join CSM</H3>
      <Stack direction="column" gap={16} align="stretch">
        {OPTIONS.map((option, index) => (
          <Fragment key={option.type}>
            {index > 0 && <Divider />}
            <OptionRow option={option} apr={aprs[option.type]} />
          </Fragment>
        ))}
      </Stack>
    </Stack>
  </PromoCard>
);
