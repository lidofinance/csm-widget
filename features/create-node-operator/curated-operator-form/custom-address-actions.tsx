import { Button } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { useModalActions } from 'providers/modal-provider';
import { FC } from 'react';
import { useNavigate } from 'shared/navigate';
import { Disconnect } from 'shared/wallet';
import styled from 'styled-components';

type Props = {
  availableGatesCount: number;
};

export const CuratedOperatorCustomAddressActions: FC<Props> = ({
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
      <Description>
        To continue, connect with the address you specified as Reward/Manager
        Address
        {showCreateAnother
          ? ' or create a new Node Operator using the currently connected address'
          : ''}
        .
      </Description>
      <Disconnect onClick={() => closeModal()} fullwidth>
        Disconnect wallet
      </Disconnect>
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

const Description = styled.p`
  text-align: center;
  color: var(--lido-color-textSecondary);
  margin: 0;
`;
