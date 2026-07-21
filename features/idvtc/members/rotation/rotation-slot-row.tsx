import { Button, Text } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';
import { Stack } from 'shared/components';
import { Address } from 'shared/components/address';
import { SignOwnershipFields } from '../controls/sign-ownership-fields';
import { useMemberVerification } from '../hooks/use-member-verification';
import type { SlotDraft } from '../utils/rotation';

type RotationSlotRowProps = {
  index: number;
  currentAddress: string;
  draft: SlotDraft;
  // Addresses a proposed member must not collide with (verify-time UX guard).
  otherAddresses: string[];
  // Init mode: no current member to keep/replace — the slot is always an
  // editable, required member definition.
  mandatory?: boolean;
  onChange: (patch: Partial<SlotDraft>) => void;
};

export const RotationSlotRow: FC<RotationSlotRowProps> = ({
  index,
  currentAddress,
  draft,
  otherAddresses,
  mandatory = false,
  onChange,
}) => {
  const { isVerifying, error, verify, setError } = useMemberVerification();

  const onAddressChange = useCallback(
    (value: string) => {
      onChange({ newAddress: value, verified: false });
      setError(undefined);
    },
    [onChange, setError],
  );

  const onSignatureChange = useCallback(
    (value: string) => {
      onChange({ signature: value, verified: false });
      setError(undefined);
    },
    [onChange, setError],
  );

  const onVerify = useCallback(async () => {
    if (draft.verified) return;
    const ok = await verify({
      address: draft.newAddress,
      signature: draft.signature,
      otherAddresses,
    });
    if (ok) onChange({ verified: true });
  }, [
    draft.verified,
    draft.newAddress,
    draft.signature,
    verify,
    otherAddresses,
    onChange,
  ]);

  return (
    <Stack direction="column" gap="sm" data-testid={`rotationSlot${index}`}>
      <Stack align="center" justify="space-between">
        <Text size="xs" weight="bold">
          Cluster member #{index + 1}
        </Text>
        {!mandatory &&
          (draft.changed ? (
            <Button
              size="xs"
              variant="translucent"
              color="error"
              onClick={() =>
                onChange({
                  changed: false,
                  newAddress: '',
                  signature: '',
                  verified: false,
                  discordHandle: undefined,
                  telegramUsername: undefined,
                })
              }
              data-testid={`keepMemberButton${index}`}
            >
              Keep
            </Button>
          ) : (
            <Button
              size="xs"
              variant="translucent"
              onClick={() => onChange({ changed: true })}
              data-testid={`replaceMemberButton${index}`}
            >
              Replace
            </Button>
          ))}
      </Stack>

      {!mandatory && <Address address={currentAddress} showIcon />}

      {(mandatory || draft.changed) && (
        <SignOwnershipFields
          title={mandatory ? 'Member address' : 'New member address'}
          address={draft.newAddress}
          signature={draft.signature}
          verified={draft.verified}
          isVerifying={isVerifying}
          discordHandle={draft.discordHandle}
          telegramUsername={draft.telegramUsername}
          signatureError={error}
          onAddressChange={onAddressChange}
          onSignatureChange={onSignatureChange}
          onDiscordChange={(v) => onChange({ discordHandle: v })}
          onTelegramChange={(v) => onChange({ telegramUsername: v })}
          onVerify={() => void onVerify()}
        />
      )}
    </Stack>
  );
};
