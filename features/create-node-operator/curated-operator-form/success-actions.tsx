import { Button } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { useModalActions } from 'providers/modal-provider';
import { FC } from 'react';
import { LocalLink, useNavigate } from 'shared/navigate';
import styled from 'styled-components';

type Props = {
  availableGatesCount: number;
};

// TODO: reset
export const CuratedOperatorSuccessActions: FC<Props> = ({
  availableGatesCount,
}) => {
  const n = useNavigate();
  const { closeModal } = useModalActions();

  const handleCreateAnother = async () => {
    closeModal();
    void n(PATH.CREATE);
  };

  const showCreateAnother = availableGatesCount > 1;

  return (
    <ActionsContainer>
      <LocalLink href={PATH.KEYS_SUBMIT}>
        <Button fullwidth size="sm">
          Add keys
        </Button>
      </LocalLink>
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
    </ActionsContainer>
  );
};

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  width: 100%;
`;
