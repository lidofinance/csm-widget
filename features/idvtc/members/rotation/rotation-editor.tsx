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
  validateInitDraft,
  validateRotationDraft,
  type SlotDraft,
} from '../utils/rotation';
import { RotationSlotRow } from './rotation-slot-row';

const emptyDraft = (changed = false): SlotDraft => ({
  changed,
  newAddress: '',
  signature: '',
  verified: false,
});

type RotationEditorProps = {
  // 'init' defines all four members from zero; 'rotate' replaces a subset of
  // active members. Defaults to 'rotate'.
  mode?: 'init' | 'rotate';
  activeMembers: MemberDto[];
  // Whether the Cancel button is shown (there is somewhere to return to).
  cancelable?: boolean;
  onDone: () => void;
};

export const RotationEditor: FC<RotationEditorProps> = ({
  mode = 'rotate',
  activeMembers,
  cancelable = true,
  onDone,
}) => {
  const isInit = mode === 'init';
  const stages = useMembersModalStages();
  const submit = useSubmitRotation();
  const [slots, setSlots] = useState<SlotDraft[]>(() =>
    Array.from({ length: MEMBERS_COUNT }, () => emptyDraft(isInit)),
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
  const validationError = isInit
    ? validateInitDraft(slots)
    : validateRotationDraft(slots, activeAddresses);

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
        {isInit ? 'Add your cluster members' : 'Select the members to replace'}
      </Text>
      {slots.map((draft, index) => (
        <RotationSlotRow
          key={activeMembers[index]?.address ?? index}
          index={index}
          mandatory={isInit}
          currentAddress={activeMembers[index]?.address ?? ''}
          draft={draft}
          otherAddresses={
            isInit
              ? slots
                  .filter((_, i) => i !== index)
                  .map((s) => s.newAddress)
                  .filter(Boolean)
              : activeAddresses
          }
          onChange={(patch) => patchSlot(index, patch)}
        />
      ))}
      <Stack direction="row" gap="md">
        {cancelable && (
          <Button
            variant="translucent"
            onClick={onDone}
            data-testid="cancelRotationButton"
          >
            Cancel
          </Button>
        )}
        <Button
          fullwidth
          disabled={!!validationError || submit.isPending}
          loading={submit.isPending}
          onClick={() => void onSubmit()}
          data-testid="submitRotationButton"
        >
          {isInit
            ? 'Submit for review'
            : `Submit rotation request${
                changedCount > 0 ? ` (${changedCount})` : ''
              }`}
        </Button>
      </Stack>
    </Stack>
  );
};
