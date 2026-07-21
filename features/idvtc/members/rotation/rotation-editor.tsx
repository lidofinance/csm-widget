import { Button, Text } from '@lidofinance/lido-ui';
import { FC, useMemo, useState } from 'react';
import { Stack } from 'shared/components';
import type { MemberDto } from 'modules/surveys-sdk/generated';
import { useMembersModalStages } from '../hooks/use-members-modal-stages';
import { useSubmitRotation } from '../hooks/use-submit-rotation';
import {
  buildRotationBody,
  countChangedSlots,
  MEMBERS_COUNT,
  validateRotationDraft,
  type SlotDraft,
} from '../utils/rotation';
import { RotationSlotRow } from './rotation-slot-row';

const emptyDraft = (): SlotDraft => ({
  changed: false,
  newAddress: '',
  signature: '',
  verified: false,
});

type RotationEditorProps = {
  activeMembers: MemberDto[];
  onDone: () => void;
};

export const RotationEditor: FC<RotationEditorProps> = ({
  activeMembers,
  onDone,
}) => {
  const stages = useMembersModalStages();
  const submit = useSubmitRotation();
  const [slots, setSlots] = useState<SlotDraft[]>(() =>
    Array.from({ length: MEMBERS_COUNT }, emptyDraft),
  );

  const activeAddresses = useMemo(
    () => activeMembers.map((m) => m.address),
    [activeMembers],
  );

  const patchSlot = (index: number, patch: Partial<SlotDraft>) =>
    setSlots((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );

  const changedCount = countChangedSlots(slots);
  const validationError = validateRotationDraft(slots, activeAddresses);

  const onSubmit = async () => {
    try {
      stages.pending();
      await submit.mutateAsync(buildRotationBody(slots));
      stages.success();
      onDone();
    } catch (error) {
      stages.failed(error);
    }
  };

  return (
    <Stack direction="column" gap="xl" data-testid="rotationEditor">
      <Text size="sm" weight="bold">
        Select the members to replace
      </Text>
      {slots.map((draft, index) => (
        <RotationSlotRow
          key={activeMembers[index]?.address ?? index}
          index={index}
          currentAddress={activeMembers[index]?.address ?? ''}
          draft={draft}
          otherAddresses={activeAddresses}
          onChange={(patch) => patchSlot(index, patch)}
        />
      ))}
      <Stack direction="row" gap="md">
        <Button
          variant="translucent"
          onClick={onDone}
          data-testid="cancelRotationButton"
        >
          Cancel
        </Button>
        <Button
          fullwidth
          disabled={!!validationError || submit.isPending}
          loading={submit.isPending}
          onClick={() => void onSubmit()}
          data-testid="submitRotationButton"
        >
          Submit rotation request
          {changedCount > 0 ? ` (${changedCount})` : ''}
        </Button>
      </Stack>
    </Stack>
  );
};
