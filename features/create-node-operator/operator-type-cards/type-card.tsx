import { Button, Text } from '@lidofinance/lido-ui';
import { MODULE_METADATA, OPERATOR_TYPE_METADATA } from 'consts';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { useOperatorTypeCurve } from 'shared/hooks';
import { TypeBadgeButton } from 'shared/node-operator/operator-type';
import { LocalLink } from 'shared/navigate';
import { Parameters } from './parameters';
import { CardBody, CardColumn, CardDivider, OptionCard } from './styles';
import { VisibleType } from './use-visible-types';

export const TypeCard: FC<{ type: VisibleType }> = ({ type }) => {
  const metadata = type.type ? OPERATOR_TYPE_METADATA[type.type] : undefined;
  const curve = useOperatorTypeCurve(type.type);

  return (
    <OptionCard
      data-testid={
        metadata
          ? `operatorTypeCard-${metadata.short.toLowerCase()}`
          : 'operatorTypeCard-cm'
      }
    >
      <CardBody>
        <CardColumn>
          <Stack direction="column" gap="md">
            {type.type && (
              <TypeBadgeButton
                displayType={type.type}
                curve={curve}
                data-testid="operatorTypeCardBadge"
              />
            )}
            <Stack direction="column" gap="sm">
              <Text size="sm" weight={700}>
                {metadata?.name ?? MODULE_METADATA[MODULE_NAME.CM].title}
              </Text>
              <Text size="xxs">
                {metadata?.description ??
                  MODULE_METADATA[MODULE_NAME.CM].description}
              </Text>
              {metadata?.descriptionNote && (
                <Text size="xxs">
                  <b>{metadata.descriptionNote.lead}</b>
                  {metadata.descriptionNote.rest}
                </Text>
              )}
            </Stack>
          </Stack>
        </CardColumn>
        {type.type && (
          <>
            <CardDivider />
            <CardColumn>{curve && <Parameters type={type.type} />}</CardColumn>
          </>
        )}
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
