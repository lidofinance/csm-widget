import { PATH } from 'consts/urls';
import { FC } from 'react';
import { Latice, Stack, StepTrack, TitledValue } from 'shared/components';
import { useCreateOptions } from 'shared/hooks';
import { TypeBadgeButton } from 'shared/node-operator/operator-type';
import { useSubmitKeysFormData } from '../context';

export const CreateTypeHeader: FC = () => {
  const { type, curve } = useSubmitKeysFormData(true);
  const hasSteps = useCreateOptions().length > 1;

  return (
    <Stack direction="column" gap="sm">
      {hasSteps && (
        <>
          <StepTrack current={2} length={2} back={PATH.CREATE} />
        </>
      )}
      <Latice variant="secondary">
        <TitledValue
          title="Node operator type"
          value={
            <TypeBadgeButton
              displayType={type}
              curve={curve}
              data-testid="createTypeBadge"
            />
          }
        />
      </Latice>
    </Stack>
  );
};
