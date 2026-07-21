import type {
  ProposedSlotDto,
  RotationRequestDto,
} from 'modules/surveys-sdk/generated';

export type MemberCardState =
  | { kind: 'idle' }
  | { kind: 'editing' }
  | { kind: 'pending'; proposed: ProposedSlotDto }
  | {
      kind: 'rejected';
      proposed: ProposedSlotDto;
      comment: string | null;
      reason: string | null;
    };

export const deriveMemberCardState = (
  index: number,
  request: RotationRequestDto | null,
  editingIndex: number | null,
): MemberCardState => {
  if (editingIndex === index) return { kind: 'editing' };
  const proposed = request?.slots[index];
  if (!proposed?.newAddress) return { kind: 'idle' };
  if (request?.status === 'REVIEW') return { kind: 'pending', proposed };
  return {
    kind: 'rejected',
    proposed,
    comment: request?.comments.slots[index] ?? null,
    reason: request?.comments.reason ?? null,
  };
};

// Addresses a new proposal must not collide with: every current member plus
// every other slot's pending (REVIEW) proposal. REJECTED proposals don't
// count — the server never merges on top of a rejected request.
export const collectTakenAddresses = (
  activeAddresses: string[],
  request: RotationRequestDto | null,
  exceptIndex: number,
): string[] => {
  const slots = request?.status === 'REVIEW' ? request.slots : [];
  const proposed = slots
    .map((s, i) => (i === exceptIndex ? null : (s.newAddress ?? null)))
    .filter((a): a is string => !!a);
  return [...activeAddresses, ...proposed];
};
