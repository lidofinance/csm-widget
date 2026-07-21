import type {
  SubmitRotationRequestDto,
  SubmitRotationSlotDto,
} from 'modules/surveys-sdk/generated';

export const MEMBERS_COUNT = 4;

export type SlotDraft = {
  changed: boolean;
  newAddress: string;
  signature: string;
  discordHandle?: string;
  telegramUsername?: string;
  verified: boolean;
};

export type RotationValidationError =
  'NO_SLOTS' | 'DUPLICATE_ADDRESS' | 'ALREADY_ACTIVE' | 'UNVERIFIED';

const toSlot = (d: SlotDraft): SubmitRotationSlotDto => ({
  newAddress: d.newAddress,
  signature: d.signature,
  ...(d.discordHandle ? { discordHandle: d.discordHandle } : undefined),
  ...(d.telegramUsername
    ? { telegramUsername: d.telegramUsername }
    : undefined),
});

export const countChangedSlots = (slots: SlotDraft[]): number =>
  slots.filter((s) => s.changed).length;

export const buildRotationBody = (
  slots: SlotDraft[],
): SubmitRotationRequestDto => {
  const body: SubmitRotationRequestDto = {};
  slots.forEach((s, i) => {
    if (s.changed) {
      body[`slot${i + 1}` as keyof SubmitRotationRequestDto] = toSlot(s);
    }
  });
  return body;
};

export const validateRotationDraft = (
  slots: SlotDraft[],
  activeAddresses: string[],
): RotationValidationError | null => {
  const changed = slots.map((s, i) => ({ s, i })).filter(({ s }) => s.changed);

  if (changed.length === 0) return 'NO_SLOTS';
  if (changed.some(({ s }) => !s.verified)) return 'UNVERIFIED';

  const proposed = changed.map(({ s }) => s.newAddress.toLowerCase());
  if (new Set(proposed).size !== proposed.length) return 'DUPLICATE_ADDRESS';

  // A proposed address must not equal ANY current active member — the same rule
  // the verify-time guard (useMemberVerification) enforces, so the two agree.
  // Covers the server's MEMBERS_ADDRESS_ALREADY_ACTIVE and MEMBERS_ADDRESS_UNCHANGED.
  const active = activeAddresses.map((a) => a.toLowerCase());
  if (proposed.some((p) => active.includes(p))) return 'ALREADY_ACTIVE';

  return null;
};
