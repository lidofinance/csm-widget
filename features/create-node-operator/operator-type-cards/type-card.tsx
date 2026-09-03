import { OPERATOR_TYPE_MODULE } from '@lidofinance/lido-csm-sdk';
import { Button, Divider, Text } from '@lidofinance/lido-ui';
import { OPERATOR_TYPE_METADATA } from 'consts';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { useOperatorTypeCurveId } from 'shared/hooks';
import { TypeBadgeButton } from 'shared/node-operator/operator-type';
import { LocalLink } from 'shared/navigate';
import { Parameters } from './parameters';
import { OptionCard } from './styles';
import { VisibleType } from './use-visible-types';

export const TypeCard: FC<{ type: VisibleType }> = ({ type }) => {
  const metadata = OPERATOR_TYPE_METADATA[type.type];
  const curveId = useOperatorTypeCurveId(type.type);

  return (
    <OptionCard
      data-testid={`operatorTypeCard-${metadata.short.toLowerCase()}`}
    >
      <Stack direction="column">
        <TypeBadgeButton
          displayType={type.type}
          curveId={curveId}
          module={OPERATOR_TYPE_MODULE[type.type]}
          data-testid="operatorTypeCardBadge"
        />
        <Text size="sm" weight={700}>
          {metadata.name}
        </Text>
        <Text size="xxs" color="secondary">
          {metadata.description}
        </Text>
        {metadata.descriptionNote && (
          <Text size="xxs" color="secondary">
            <b>{metadata.descriptionNote.lead}</b>
            {metadata.descriptionNote.rest}
          </Text>
        )}
        <Divider />
      </Stack>
      <Stack direction="column">
        {curveId !== undefined && (
          <Parameters curveId={curveId} type={type.type} />
        )}
        <LocalLink href={type.href} matomoEvent={type.matomoEvent}>
          <Button
            fullwidth
            size="sm"
            variant={type.primary ? 'filled' : 'translucent'}
          >
            {type.label}
          </Button>
        </LocalLink>
      </Stack>
    </OptionCard>
  );
};
