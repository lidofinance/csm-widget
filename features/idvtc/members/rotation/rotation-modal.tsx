import {
  Button,
  Divider,
  IconCheck,
  Modal,
  Stack,
  Tag,
} from '@lidofinance/lido-app-ui';
import { FC, useState } from 'react';
import type { MemberDto } from 'modules/surveys-sdk/generated';
import { SignOwnershipFields } from '../controls/sign-ownership-fields';
import { useMemberVerification } from '../hooks/use-member-verification';
import { useMembersModalStages } from '../hooks/use-members-modal-stages';
import { useSubmitRotation } from '../hooks/use-submit-rotation';
import { MemberSummary } from '../initialized/member-summary';
import {
  buildSlotPatch,
  emptySlotDraft,
  validateSlotDraft,
  type SlotDraft,
} from '../utils/rotation';
import { useConfirmRotationModal } from './confirm-rotation-modal';

type RotationModalProps = {
  index: number;
  member: MemberDto;
  // Active members + other slots' pending proposals (see collectTakenAddresses).
  takenAddresses: string[];
  onClose: () => void;
};

export const RotationModal: FC<RotationModalProps> = ({
  index,
  member,
  takenAddresses,
  onClose,
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
    const ok = await confirm({ index, current: member, next: draft });
    if (!ok) return;
    try {
      stages.pending();
      await submit.mutateAsync(buildSlotPatch(index, draft));
      stages.success();
      onClose();
    } catch (err) {
      stages.failed(err);
    }
  };

  return (
    <Modal
      withOverlay
      title="Cluster member rotation"
      onClose={onClose}
      data-testid={`rotationForm${index}`}
    >
      <Stack gap={24}>
        <MemberSummary
          title={`Current cluster member #${index + 1}`}
          member={member}
          tag={
            <Tag variant="success" icon={<IconCheck />}>
              Verified
            </Tag>
          }
        />
        <Divider />
        <SignOwnershipFields
          title={`New cluster member #${index + 1}`}
          memberNumber={index + 1}
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
        <Stack direction={{ base: 'row', sm: 'column' }} gap={12}>
          <Button
            fullWidth
            disabled={!!validationError || submit.isPending}
            loading={submit.isPending}
            onClick={() => void onSubmit()}
            dataTestId={{ root: `confirmRotationButton${index}` }}
          >
            Confirm rotation request
          </Button>
          <Button
            fullWidth
            variant="outline"
            onClick={onClose}
            dataTestId={{ root: `cancelRotationModalButton${index}` }}
          >
            Cancel rotation
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
