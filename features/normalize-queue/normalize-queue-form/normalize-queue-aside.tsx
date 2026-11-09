import { DataListRow, Stack, TextLink } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { SubmitAside, SubmitButton } from 'shared/form-page';
import { Gate } from 'shared/navigate';
import { useNormalizeQueueFlow, useNormalizeQueueFormData } from './context';
import { getNormalizeQueueView } from './normalize-queue-state';

export const NormalizeQueueAside: FC = () => {
  const { unqueuedCount } = useNormalizeQueueFormData(true);
  const { canNormalize, disabledReason } = getNormalizeQueueView(
    useNormalizeQueueFlow().action,
  );

  return (
    <SubmitAside
      rows={
        <DataListRow
          label="Unqueued keys count"
          value={unqueuedCount}
          dataTestId={{
            root: 'unqueuedKeysCount',
            value: 'unqueuedKeysCountValue',
          }}
        />
      }
    >
      <SubmitButton
        disabledReason={disabledReason}
        data-testid="normalizeQueueButton"
      >
        Normalizing queue
      </SubmitButton>
      {canNormalize && (
        <Gate rule="HAS_MANAGER_ROLE">
          <Stack align="center">
            <TextLink href={PATH.KEYS_SUBMIT}>Or submit more keys</TextLink>
          </Stack>
        </Gate>
      )}
    </SubmitAside>
  );
};
