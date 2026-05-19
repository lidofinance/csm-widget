import { Button, Divider, Text } from '@lidofinance/lido-ui';
import { OPERATOR_TYPE_METADATA } from 'consts';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { CurveBadge } from 'shared/node-operator/curve-badge/curve-badge';
import { LocalLink } from 'shared/navigate';
import { Parameters } from './parameters';
import { OptionCard } from './styles';
import { VisibleType } from './use-visible-types';

export const TypeCard: FC<{ type: VisibleType }> = ({ type }) => {
  const metadata = OPERATOR_TYPE_METADATA[type.type];

  return (
    <OptionCard>
      <Stack direction="column">
        <CurveBadge type={type.type} inline />
        <Text size="sm" weight={700}>
          {metadata.name}
        </Text>
        <Text size="xxs" color="secondary">
          {metadata.description}
        </Text>
        <Divider />
      </Stack>
      <Stack direction="column">
        {metadata.curveId !== undefined && (
          <Parameters curveId={metadata.curveId} />
        )}
        <LocalLink
          href={type.href}
          query={type.query}
          matomoEvent={type.matomoEvent}
        >
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
