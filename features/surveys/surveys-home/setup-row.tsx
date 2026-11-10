import { BodyLarge, Button } from '@lidofinance/lido-app-ui';
import { FC, useCallback } from 'react';
import { HubList, HubRow, Plural } from 'shared/components';
import { isAuthError, OperatorKey } from 'modules/surveys-sdk';
import { formatDaysAgo } from 'utils';
import { useConfirmRemoveSetupModal } from '../survey-setup/confirm-remove-modal-app';
import { useModalStages } from '../survey-setup/use-modal-stages';
import { useOperatorSetup } from '../survey-setup/use-operator-setup';
import { useSetupsKeys } from '../survey-setup/use-setups-keys';
import type { SetupRaw } from '../types';

type SetupRowProps = {
  setup: SetupRaw;
  operatorKey?: OperatorKey;
  editHref: string;
};

export const SetupRow: FC<SetupRowProps> = ({
  setup,
  operatorKey,
  editHref,
}) => {
  const { remove } = useOperatorSetup(setup.index, {
    operatorKey,
    invalidateOnMutate: !!operatorKey,
  });
  const { mutate: mutateKeys } = useSetupsKeys(operatorKey);
  const { txModalStages: modals } = useModalStages();
  const confirmRemove = useConfirmRemoveSetupModal();

  const handleRemove = useCallback(async () => {
    if (!(await confirmRemove({}))) return;
    modals.pendingRemove();
    try {
      await remove();
      void mutateKeys();
      modals.successRemove();
    } catch (e) {
      if (!isAuthError(e)) modals.failed(e);
    }
  }, [confirmRemove, modals, mutateKeys, remove]);

  return (
    <HubList>
      <HubRow
        title={
          <>
            Setup #{setup.index}{' '}
            <BodyLarge as="span" color="tertiary">
              {setup.keysCount}{' '}
              <Plural value={setup.keysCount} variants={['key', 'keys']} />
            </BodyLarge>
          </>
        }
        description={`Updated ${formatDaysAgo(setup.updatedAt)}`}
        trailing={
          <>
            <Button size="small" variant="outline" href={editHref}>
              Edit
            </Button>
            <Button size="small" variant="outline" onClick={handleRemove}>
              Delete
            </Button>
          </>
        }
      />
    </HubList>
  );
};
