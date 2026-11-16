import {
  Button,
  Card,
  Description,
  SegmentedBar,
  Stack,
} from '@lidofinance/lido-app-ui';
import { FC, useState } from 'react';
import { SignOwnershipFields } from '../controls/sign-ownership-fields';
import { useMemberVerification } from '../hooks/use-member-verification';
import { useMembersModalStages } from '../hooks/use-members-modal-stages';
import { useSubmitRotation } from '../hooks/use-submit-rotation';
import {
  buildInitBody,
  emptySlotDraft,
  MEMBERS_COUNT,
  validateInitDraft,
  type SlotDraft,
} from '../utils/rotation';

type InitMemberCardProps = {
  index: number;
  draft: SlotDraft;
  otherAddresses: string[];
  onChange: (patch: Partial<SlotDraft>) => void;
};

// Own component per card so each slot gets its own verification state.
const InitMemberCard: FC<InitMemberCardProps> = ({
  index,
  draft,
  otherAddresses,
  onChange,
}) => {
  const { isVerifying, error, verify, setError } = useMemberVerification();

  const onVerify = async () => {
    if (draft.verified) return;
    const ok = await verify({
      address: draft.newAddress,
      signature: draft.signature,
      otherAddresses,
    });
    if (ok) onChange({ verified: true });
  };

  return (
    <Card data-testid={`initMemberCard${index}`}>
      <SignOwnershipFields
        title={`Cluster member #${index + 1}`}
        memberNumber={index + 1}
        address={draft.newAddress}
        signature={draft.signature}
        verified={draft.verified}
        isVerifying={isVerifying}
        discordHandle={draft.discordHandle}
        telegramUsername={draft.telegramUsername}
        signatureError={error}
        onAddressChange={(v) => {
          onChange({ newAddress: v, verified: false });
          setError(undefined);
        }}
        onSignatureChange={(v) => {
          onChange({ signature: v, verified: false });
          setError(undefined);
        }}
        onDiscordChange={(v) => onChange({ discordHandle: v })}
        onTelegramChange={(v) => onChange({ telegramUsername: v })}
        onClear={() => {
          onChange({ newAddress: '', signature: '', verified: false });
          setError(undefined);
        }}
        onVerify={() => void onVerify()}
      />
    </Card>
  );
};

type InitEditorProps = {
  // Whether Cancel is shown (there is a pending/rejected request to return to).
  cancelable: boolean;
  onDone: () => void;
};

export const InitEditor: FC<InitEditorProps> = ({ cancelable, onDone }) => {
  const stages = useMembersModalStages();
  const submit = useSubmitRotation();
  const [slots, setSlots] = useState<SlotDraft[]>(() =>
    Array.from({ length: MEMBERS_COUNT }, emptySlotDraft),
  );

  const patchSlot = (index: number, patch: Partial<SlotDraft>) =>
    setSlots((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );

  const verifiedCount = slots.filter((s) => s.verified).length;
  const validationError = validateInitDraft(slots);

  const onSubmit = async () => {
    try {
      stages.pending();
      await submit.mutateAsync(buildInitBody(slots));
      stages.success();
      onDone();
    } catch (error) {
      stages.failed(error);
    }
  };

  return (
    <Stack gap={8} data-testid="initEditor">
      <Description color="secondary">
        Verify ownership of {MEMBERS_COUNT} additional Ethereum addresses in
        your validator cluster
      </Description>

      <Stack gap={4} data-testid="initProgress">
        <SegmentedBar
          steps={MEMBERS_COUNT}
          value={verifiedCount}
          aria-label="Verified cluster members"
        />
        <Description color="secondary">
          {verifiedCount} / {MEMBERS_COUNT} verified
        </Description>
      </Stack>

      {slots.map((draft, index) => (
        <InitMemberCard
          key={index}
          index={index}
          draft={draft}
          otherAddresses={slots
            .filter((_, i) => i !== index)
            .map((s) => s.newAddress)
            .filter(Boolean)}
          onChange={(patch) => patchSlot(index, patch)}
        />
      ))}

      <Stack direction={{ base: 'row', sm: 'column' }} gap={12}>
        <Button
          fullWidth
          disabled={!!validationError || submit.isPending}
          loading={submit.isPending}
          onClick={() => void onSubmit()}
          dataTestId={{ root: 'submitInitButton' }}
        >
          Submit for review
        </Button>
        {cancelable && (
          <Button
            fullWidth
            variant="outline"
            onClick={onDone}
            dataTestId={{ root: 'cancelInitEditorButton' }}
          >
            Cancel
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
