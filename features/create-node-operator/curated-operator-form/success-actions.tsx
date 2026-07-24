import { Button } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { useModalActions } from 'providers/modal-provider';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { LocalLink, useNavigate } from 'shared/navigate';

type Props = {
  availableGatesCount: number;
  hasManagerRole: boolean;
};

export const CuratedOperatorSuccessActions: FC<Props> = ({
  availableGatesCount,
  hasManagerRole,
}) => {
  const n = useNavigate();
  const { closeModal } = useModalActions();

  const handleCreateAnother = async () => {
    closeModal();
    void n(PATH.CREATE);
  };

  const showCreateAnother = availableGatesCount > 1;

  return (
    <Stack direction="column" gap="sm">
      {hasManagerRole && (
        <LocalLink href={PATH.KEYS_SUBMIT}>
          <Button fullwidth size="sm">
            Add keys
          </Button>
        </LocalLink>
      )}
      {showCreateAnother && (
        <Button
          fullwidth
          size="sm"
          variant="outlined"
          onClick={handleCreateAnother}
        >
          Create another Node Operator
        </Button>
      )}
    </Stack>
  );
};
