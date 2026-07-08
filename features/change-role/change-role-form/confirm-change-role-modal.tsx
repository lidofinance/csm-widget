import { Button, Modal, Text } from '@lidofinance/lido-ui';

import type { ModalComponentType } from 'providers/modal-provider';
import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from 'shared/components';
import { ConfirmModalProps } from 'shared/hooks';

type Props = {
  showRewards: boolean;
  isProposal: boolean;
  showRepropose: boolean;
};

type Step = 'rewards' | 'repropose';

export const ConfirmChangeRoleModal: ModalComponentType<
  ConfirmModalProps & Props
> = ({
  showRewards,
  isProposal,
  showRepropose,
  onConfirm,
  onReject,
  ...props
}) => {
  const steps = useMemo(
    () =>
      [showRewards && 'rewards', showRepropose && 'repropose'].filter(
        Boolean,
      ) as Step[],
    [showRewards, showRepropose],
  );

  const [index, setIndex] = useState(0);
  const current = steps[index];
  const isLast = index >= steps.length - 1;

  const onContinue = useCallback(() => {
    if (isLast) onConfirm();
    else setIndex((i) => i + 1);
  }, [isLast, onConfirm]);

  return (
    <Modal {...props} center onClose={onReject}>
      <Stack direction="column" gap="xxl">
        {current === 'rewards' ? (
          <RewardsStep isProposal={isProposal} />
        ) : (
          <ReproposeStep />
        )}

        <Stack direction="column" gap="sm">
          <Button fullwidth onClick={onContinue}>
            Continue
          </Button>
          {current === 'rewards' && isProposal && (
            <Text size="xxs" color="secondary">
              The change doesn’t apply immediately. To complete the address
              change, the owner of the new address must confirm the change.
            </Text>
          )}
        </Stack>
      </Stack>
    </Modal>
  );
};

const RewardsStep: FC<{ isProposal: boolean }> = ({ isProposal }) => (
  <Stack direction="column" gap="sm">
    <Text as="h5" size="sm" weight={700}>
      {isProposal
        ? 'All rewards will be claimable to the proposed address'
        : 'All rewards will be claimable to the new address'}
    </Text>
    <Text size="xs" color="secondary">
      After changing the Rewards Address, all rewards and excess bond
      accumulated on the bond balance can be claimed to the new Rewards Address.
      In the event of validator withdrawal, the whole bond is also returned to
      the new address.
    </Text>
  </Stack>
);

const ReproposeStep: FC = () => (
  <Stack direction="column" gap="sm">
    <Text as="h5" size="sm" weight={700}>
      Only most recent proposed address change is valid
    </Text>
    <Text size="xs" color="secondary">
      When you propose a new address for change - the previous change proposal
      is voided
    </Text>
  </Stack>
);
