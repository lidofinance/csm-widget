import { Divider, H3, Stack, Typography } from '@lidofinance/lido-app-ui';
import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FC, Fragment } from 'react';
import styled from 'styled-components';
import { useModuleOpen } from 'shared/hooks/can-create/use-module-open';
import badge0x01 from 'assets/illustrations/operator-type/0x01.svg';
import badge0x02 from 'assets/illustrations/operator-type/0x02.svg';
import badgeIcs from 'assets/illustrations/operator-type/ics.svg';
import badgeIdvtc from 'assets/illustrations/operator-type/idvtc.svg';
import { ModuleStatusTag, PromoCard, SecondaryText } from '../components';
import { isStatVisible, StatBody } from './stat-body';
import { AprType, Stat } from './use-csm-stats';

type Option = {
  type: AprType;
  name: string;
  description: string;
  badge: string;
};

const OPTIONS: Option[] = [
  {
    type: OPERATOR_TYPE.CSM_DEF,
    name: 'Default',
    description: 'The simplest way to start validating in CSM',
    badge: badge0x01,
  },
  {
    type: OPERATOR_TYPE.CSM_ICS,
    name: 'ICS',
    description: 'Get verified and unlock better parameters',
    badge: badgeIcs,
  },
  {
    type: OPERATOR_TYPE.CSM_IDVTC,
    name: 'IDVTC',
    description: 'Join a cluster of solo stakers to get better parameters',
    badge: badgeIdvtc,
  },
  {
    type: OPERATOR_TYPE.CSM2_DEF,
    name: '0x02',
    description: 'Validate up to 2,048 ETH per key for enhanced economics',
    badge: badge0x02,
  },
];

const Badge = styled.img`
  flex: none;
  width: 52px;
  height: 52px;
`;

const TextColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AprColumn = styled.div`
  flex: none;
  width: 60px;
  text-align: right;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ComingSoonTag: FC = () => {
  const { isOpen, isPending } = useModuleOpen(MODULE_NAME.CSM_02);
  return isOpen || isPending ? null : <ModuleStatusTag variant="coming-soon" />;
};

type OptionRowProps = { option: Option; apr: Stat<number> };

const OptionRow: FC<OptionRowProps> = ({ option, apr }) => (
  <Row>
    <Badge src={option.badge} alt="" width={52} height={52} />
    <TextColumn>
      <Stack direction="row" gap={8} align="center">
        <Typography variant="bodyLarge" weight="semibold">
          {option.name}
        </Typography>
        {option.type === OPERATOR_TYPE.CSM2_DEF && <ComingSoonTag />}
      </Stack>
      <SecondaryText variant="description">{option.description}</SecondaryText>
    </TextColumn>
    {isStatVisible(apr) && (
      <AprColumn>
        <SecondaryText variant="description">APY up to</SecondaryText>
        <StatBody
          stat={apr}
          format={(value) => (
            <Typography variant="bodyLarge" weight="semibold">
              {value}%*
            </Typography>
          )}
        />
      </AprColumn>
    )}
  </Row>
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
