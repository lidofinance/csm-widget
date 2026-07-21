import type {
  SubmitRotationRequestDto,
  SubmitRotationSlotDto,
} from 'modules/surveys-sdk/generated';

export const MEMBERS_COUNT = 4;

export type SlotDraft = {
  newAddress: string;
  signature: string;
  discordHandle?: string;
  telegramUsername?: string;
  verified: boolean;
};

export type RotationValidationError =
  'INCOMPLETE' | 'UNVERIFIED' | 'DUPLICATE_ADDRESS' | 'ALREADY_ACTIVE';

export const emptySlotDraft = (): SlotDraft => ({
  newAddress: '',
  signature: '',
  verified: false,
});

const slotKey = (index: number) =>
  `slot${index + 1}` as keyof SubmitRotationRequestDto;

const toSlot = (d: SlotDraft): SubmitRotationSlotDto => ({
  newAddress: d.newAddress,
  signature: d.signature,
  ...(d.discordHandle ? { discordHandle: d.discordHandle } : undefined),
  ...(d.telegramUsername
    ? { telegramUsername: d.telegramUsername }
    : undefined),
});

// The submit endpoint is a JSON merge-patch: omitted slots carry over the
// pending rotation server-side, null cancels a slot, an object sets/replaces
// it. The widget never resubmits untouched slots.
export const buildSlotPatch = (
  index: number,
  draft: SlotDraft,
): SubmitRotationRequestDto => ({ [slotKey(index)]: toSlot(draft) });

export const buildCancelPatch = (index: number): SubmitRotationRequestDto => ({
  [slotKey(index)]: null,
});

export const buildCancelAllPatch = (): SubmitRotationRequestDto => ({
  slot1: null,
  slot2: null,
  slot3: null,
  slot4: null,
});

export const buildInitBody = (
  slots: SlotDraft[],
): SubmitRotationRequestDto => ({
  slot1: toSlot(slots[0]),
  slot2: toSlot(slots[1]),
  slot3: toSlot(slots[2]),
  slot4: toSlot(slots[3]),
});

// takenAddresses = current active members + other slots' pending proposals —
// the server rejects a merged request colliding with either (ALREADY_ACTIVE /
// DUPLICATE_SLOT_ADDRESS / UNCHANGED), so the CTA stays disabled until clean.
export const validateSlotDraft = (
  draft: SlotDraft,
  takenAddresses: string[],
): RotationValidationError | null => {
  if (!draft.newAddress || !draft.signature) return 'INCOMPLETE';
  if (!draft.verified) return 'UNVERIFIED';
  const proposed = draft.newAddress.toLowerCase();
  if (takenAddresses.some((a) => a.toLowerCase() === proposed))
    return 'ALREADY_ACTIVE';
  return null;
};

// Init-from-scratch: every one of the MEMBERS_COUNT slots must be a fully
// defined, verified, unique member (there are no active members to inherit).
export const validateInitDraft = (
  slots: SlotDraft[],
): RotationValidationError | null => {
  if (
    slots.length !== MEMBERS_COUNT ||
    slots.some((s) => !s.newAddress || !s.signature)
  )
    return 'INCOMPLETE';
  if (slots.some((s) => !s.verified)) return 'UNVERIFIED';
  const proposed = slots.map((s) => s.newAddress.toLowerCase());
  if (new Set(proposed).size !== proposed.length) return 'DUPLICATE_ADDRESS';
  return null;
};
