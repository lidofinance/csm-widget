import { Button, Divider } from '@lidofinance/lido-ui';
import { FC, useState } from 'react';
import { Stack } from 'shared/components';
import { SignOwnershipFields } from '../controls/sign-ownership-fields';
import { useMemberVerification } from '../hooks/use-member-verification';
import { useMembersModalStages } from '../hooks/use-members-modal-stages';
import { useSubmitRotation } from '../hooks/use-submit-rotation';
import {
  buildSlotPatch,
  emptySlotDraft,
  validateSlotDraft,
  type SlotDraft,
} from '../utils/rotation';
import { useConfirmRotationModal } from './confirm-rotation-modal';

type RotationFormProps = {
  index: number;
  currentAddress: string;
  // Active members + other slots' pending proposals (see collectTakenAddresses).
  takenAddresses: string[];
  onDone: () => void;
};

export const RotationForm: FC<RotationFormProps> = ({
  index,
  currentAddress,
  takenAddresses,
  onDone,
}) => {
  const [draft, setDraft] = useState<SlotDraft>(emptySlotDraft);
  const { isVerifying, error, verify, setError } = useMemberVerification();
  const confirm = useConfirmRotationModal();
  const stages = useMembersModalStages();
  const submit = useSubmitRotation();

  const patch = (p: Partial<SlotDraft>) =>
    setDraft((prev) => ({ ...prev, ...p }));

  const onVerify = async () => {
    if (draft.verified) return;
    const ok = await verify({
      address: draft.newAddress,
      signature: draft.signature,
      otherAddresses: takenAddresses,
    });
    if (ok) patch({ verified: true });
  };

  const validationError = validateSlotDraft(draft, takenAddresses);

  const onSubmit = async () => {
    const ok = await confirm({
      currentAddress,
      newAddress: draft.newAddress,
    });
    if (!ok) return;
    try {
      stages.pending();
      await submit.mutateAsync(buildSlotPatch(index, draft));
      stages.success();
      onDone();
    } catch (err) {
      stages.failed(err);
    }
  };

  return (
    <Stack direction="column" gap="md" data-testid={`rotationForm${index}`}>
      <Divider />
      <SignOwnershipFields
        title={`New cluster member address #${index + 1}`}
        address={draft.newAddress}
        signature={draft.signature}
        verified={draft.verified}
        isVerifying={isVerifying}
        discordHandle={draft.discordHandle}
        telegramUsername={draft.telegramUsername}
        signatureError={error}
        onAddressChange={(v) => {
          patch({ newAddress: v, verified: false });
          setError(undefined);
        }}
        onSignatureChange={(v) => {
          patch({ signature: v, verified: false });
          setError(undefined);
        }}
        onDiscordChange={(v) => patch({ discordHandle: v })}
        onTelegramChange={(v) => patch({ telegramUsername: v })}
        onClear={() => {
          patch({ newAddress: '', signature: '', verified: false });
          setError(undefined);
        }}
        onVerify={() => void onVerify()}
      />
      <Button
        fullwidth
        disabled={!!validationError || submit.isPending}
        loading={submit.isPending}
        onClick={() => void onSubmit()}
        data-testid={`confirmRotationButton${index}`}
      >
        Confirm rotation request
      </Button>
    </Stack>
  );
};
