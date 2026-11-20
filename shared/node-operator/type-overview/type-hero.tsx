import { OPERATOR_TYPE, TOKENS } from '@lidofinance/lido-csm-sdk';
import { Body, Card, H1, Stack, StatItem } from '@lidofinance/lido-app-ui';
import { OPERATOR_TYPE_METADATA } from 'consts';
import { FC, ReactNode } from 'react';
import { formatPercentKeyIntervalRows } from 'shared/components/parameters-list/format';
import { FormatToken } from 'shared/formatters';
import { useOperatorTypeParameters } from 'shared/hooks';
import { TypeBadge } from '../type-badge';
import s from './type-hero.module.css';

type Props = {
  type: OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC;
  cta?: ReactNode;
};

export const TypeHero: FC<Props> = ({ type, cta }) => {
  const { name, description, capitalMultiplier } = OPERATOR_TYPE_METADATA[type];
  const { data: params } = useOperatorTypeParameters(type);

  const [firstReward] = formatPercentKeyIntervalRows(params?.rewardsConfig);
  const hasTiers = (params?.rewardsConfig?.length ?? 0) > 1;
  const firstBond = params?.bondConfig?.[0]?.value;

  return (
    <Card dataTestId={{ root: 'typeHero' }}>
      <Stack direction="row" align="center" justify="between" gap={24}>
        <Stack grow align="start" gap={16}>
          <H1>{name}</H1>
          <Body color="secondary">{description}</Body>
          <div className={s.stats}>
            <StatItem
              align="left"
              label="Node Operator reward"
              value={firstReward?.value ?? '–'}
              subValue={hasTiers ? firstReward?.label.toLowerCase() : undefined}
            />
            <StatItem
              align="left"
              label="Capital multiplier"
              value={capitalMultiplier}
            />
            <StatItem
              align="left"
              label="First key bond"
              value={
                firstBond !== undefined ? (
                  <FormatToken amount={firstBond} token={TOKENS.eth} />
                ) : (
                  '–'
                )
              }
            />
            <StatItem align="left" label="Credential type" value="0x01" />
          </div>
          {cta && <div className={s.cta}>{cta}</div>}
        </Stack>
        <div className={s.badge}>
          <TypeBadge type={type} size={240} />
        </div>
      </Stack>
    </Card>
  );
};
