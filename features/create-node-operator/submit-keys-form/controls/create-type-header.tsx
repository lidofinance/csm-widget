import { PATH } from 'consts/urls';
import { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';
import { useCreateType } from 'providers/create-type-provider';
import { BackButton, Stack, StepTrack } from 'shared/components';
import { useCreateOptions } from 'shared/hooks';
import { TypeBadgeButton } from 'shared/node-operator/operator-type';

export const CreateTypeHeader: FC = () => {
  const { type, curveId, module } = useCreateType();
  const hasSteps = useCreateOptions().length > 1;

  return (
    <Stack direction="column" gap="sm">
      {hasSteps && (
        <>
          <BackButton href={PATH.CREATE} />
          <StepTrack current={2} length={2} />
        </>
      )}
      <Text as="h3" size="lg" weight={700}>
        Upload your first key(s)
      </Text>
      <Stack direction="row" gap="sm" center>
        <Text size="xs">Node operator type:</Text>
        <TypeBadgeButton
          displayType={type}
          curveId={curveId}
          module={module}
          data-testid="createTypeBadge"
        />
      </Stack>
    </Stack>
  );
};
