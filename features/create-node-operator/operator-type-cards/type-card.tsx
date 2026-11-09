import { Button, Description, H3, Stack } from '@lidofinance/lido-app-ui';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { MODULE_METADATA, OPERATOR_TYPE_METADATA } from 'consts';
import { FC } from 'react';
import { useOperatorTypeCurve } from 'shared/hooks';
import { TypeBadgeButton } from 'shared/node-operator/operator-type';
import { trackMatomoEvent } from 'utils';
import { Parameters } from './parameters';
import { getTypeTagline } from './type-taglines';
import { VisibleType } from './use-visible-types';

export const TypeCard: FC<{ type: VisibleType }> = ({ type }) => {
  const metadata = type.type ? OPERATOR_TYPE_METADATA[type.type] : undefined;
  const curve = useOperatorTypeCurve(type.type);

  return (
    <Stack
      grow
      gap={16}
      justify="between"
      data-testid={
        metadata
          ? `operatorTypeCard-${metadata.short.toLowerCase()}`
          : 'operatorTypeCard-cm'
      }
    >
      <Stack gap={16}>
        {type.type && (
          <div>
            <TypeBadgeButton
              displayType={type.type}
              curve={curve}
              data-testid="operatorTypeCardBadge"
            />
          </div>
        )}
        <Stack gap={8}>
          <H3 as="h2">
            {metadata?.short ?? MODULE_METADATA[MODULE_NAME.CM].title}
          </H3>
          <Description as="p">{getTypeTagline(type.type)}</Description>
        </Stack>
        {type.type && curve && <Parameters type={type.type} />}
      </Stack>
      <Button
        fullWidth
        href={type.href}
        variant={type.primary ? 'primary' : 'outline'}
        onClick={() => trackMatomoEvent(type.matomoEvent)}
      >
        {type.label}
      </Button>
    </Stack>
  );
};
