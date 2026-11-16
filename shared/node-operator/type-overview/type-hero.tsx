import { OPERATOR_TYPE, TOKENS } from '@lidofinance/lido-csm-sdk';
import { Body, Card, H1, StatItem } from '@lidofinance/lido-app-ui';
import { OPERATOR_TYPE_METADATA } from 'consts';
import { FC, ReactNode } from 'react';
import { formatPercentKeyIntervalRows } from 'shared/components/parameters-list/format';
import { FormatToken } from 'shared/formatters';
import { useOperatorTypeParameters } from 'shared/hooks';
import styled from 'styled-components';
import { TypeBadge } from '../type-badge';

type Props = {
  type: OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC;
  cta?: ReactNode;
};

const HeroStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

const BodyStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  min-width: 0;
`;

const StatsStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 32px;
  justify-content: start;

  @media (max-width: 899px) {
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
  }
`;

const CtaStyle = styled.div`
  @media (max-width: 599px) {
    align-self: stretch;

    button {
      width: 100%;
    }
  }
`;

const BadgeStyle = styled.div`
  flex: none;

  @media (max-width: 899px) {
    display: none;
  }
`;

export const TypeHero: FC<Props> = ({ type, cta }) => {
  const { name, description, capitalMultiplier } = OPERATOR_TYPE_METADATA[type];
  const { data: params } = useOperatorTypeParameters(type);

  const [firstReward] = formatPercentKeyIntervalRows(params?.rewardsConfig);
  const hasTiers = (params?.rewardsConfig?.length ?? 0) > 1;
  const firstBond = params?.bondConfig?.[0]?.value;

  return (
    <Card dataTestId={{ root: 'typeHero' }}>
      <HeroStyle>
        <BodyStyle>
          <H1>{name}</H1>
          <Body color="secondary">{description}</Body>
          <StatsStyle>
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
          </StatsStyle>
          {cta && <CtaStyle>{cta}</CtaStyle>}
        </BodyStyle>
        <BadgeStyle>
          <TypeBadge type={type} size={240} />
        </BadgeStyle>
      </HeroStyle>
    </Card>
  );
};
