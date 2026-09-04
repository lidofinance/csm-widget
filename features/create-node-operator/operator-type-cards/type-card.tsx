import { OPERATOR_TYPE_INFO } from '@lidofinance/lido-csm-sdk';
import { Button, Text } from '@lidofinance/lido-ui';
import { OPERATOR_TYPE_METADATA } from 'consts';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { useOperatorTypeCurveId } from 'shared/hooks';
import { TypeBadgeButton } from 'shared/node-operator/operator-type';
import { LocalLink } from 'shared/navigate';
import { Parameters } from './parameters';
import { CardBody, CardColumn, CardDivider, OptionCard } from './styles';
import { VisibleType } from './use-visible-types';

export const TypeCard: FC<{ type: VisibleType }> = ({ type }) => {
  const metadata = OPERATOR_TYPE_METADATA[type.type];
  const curveId = useOperatorTypeCurveId(type.type);

  return (
    <OptionCard
      data-testid={`operatorTypeCard-${metadata.short.toLowerCase()}`}
    >
      <CardBody>
        <CardColumn>
          <Stack direction="column" gap="md">
            <TypeBadgeButton
              displayType={type.type}
              curveId={curveId}
              module={OPERATOR_TYPE_INFO[type.type].module}
              data-testid="operatorTypeCardBadge"
            />
            <Stack direction="column" gap="sm">
              <Text size="sm" weight={700}>
                {metadata.name}
              </Text>
              <Text size="xxs">{metadata.description}</Text>
              {metadata.descriptionNote && (
                <Text size="xxs">
                  <b>{metadata.descriptionNote.lead}</b>
                  {metadata.descriptionNote.rest}
                </Text>
              )}
            </Stack>
          </Stack>
        </CardColumn>
        <CardDivider />
        <CardColumn>
          {curveId !== undefined && (
            <Parameters curveId={curveId} type={type.type} />
          )}
        </CardColumn>
      </CardBody>
      <LocalLink href={type.href} matomoEvent={type.matomoEvent}>
        <Button
          fullwidth
          size="sm"
          variant={type.primary ? 'filled' : 'translucent'}
        >
          {type.label}
        </Button>
      </LocalLink>
    </OptionCard>
  );
};
