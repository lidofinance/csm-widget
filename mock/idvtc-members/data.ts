import type {
  MemberDto,
  RotationRequestCommentsDto,
  RotationRequestDto,
  RotationRequestStatus,
} from 'modules/surveys-sdk/generated';

export const MOCK_OPERATOR_ID = 123n;

export const ACTIVE_ADDRESSES = [
  '0x6e5e5ea3f8072a6d31ce39f5a24bb0e0e05ce5ae',
  '0xc3c2ab5a2b6f6d92d543cc74e0eb622e8f8493aa',
  '0x9dca61f5c8f0421f9e4c1c0a8f31b76d59c1b906',
  '0xf99fbd6161cb420c88ca4c6d94e0f501d16041cb',
] as const;

export const PROPOSED_ADDRESSES = [
  '0xdeadbeef254729296a45a3885639ac7e10f9d547',
  '0xc0ffee254729296a45a3885639ac7e10f9d54979',
] as const;

export const mockMembers: MemberDto[] = [
  {
    address: ACTIVE_ADDRESSES[0],
    discordHandle: 'yourfavoriteCSMvalidator',
    telegramUsername: 'yourfavoriteCSMvalidator',
  },
  {
    address: ACTIVE_ADDRESSES[1],
    discordHandle: 'clusterMemberTwo',
    telegramUsername: null,
  },
  {
    address: ACTIVE_ADDRESSES[2],
    discordHandle: null,
    telegramUsername: 'clusterMemberThree',
  },
  {
    address: ACTIVE_ADDRESSES[3],
    discordHandle: null,
    telegramUsername: null,
  },
];

const EMPTY_COMMENTS: RotationRequestCommentsDto = {
  reason: null,
  slots: [null, null, null, null],
};

type RequestOverrides = {
  status?: RotationRequestStatus;
  slots?: RotationRequestDto['slots'];
  comments?: RotationRequestCommentsDto;
};

export const mockRotationRequest = (
  over: RequestOverrides = {},
): RotationRequestDto => ({
  id: 1,
  nodeOperatorId: `${MOCK_OPERATOR_ID}`,
  submitterAddress: ACTIVE_ADDRESSES[0],
  slots: [{}, {}, {}, {}],
  status: 'REVIEW',
  superseded: false,
  comments: EMPTY_COMMENTS,
  createdAt: '2026-07-19T12:00:00Z',
  updatedAt: '2026-07-19T12:00:00Z',
  ...over,
});

// One pending rotation on member #2.
export const pendingOneRequest = mockRotationRequest({
  slots: [
    {},
    {
      newAddress: PROPOSED_ADDRESSES[0],
      discordHandle: 'newMemberTwo',
      telegramUsername: 'newMemberTwo',
    },
    {},
    {},
  ],
});

// Pending rotations on members #2 and #4.
export const pendingTwoRequest = mockRotationRequest({
  slots: [
    {},
    { newAddress: PROPOSED_ADDRESSES[0], discordHandle: 'newMemberTwo' },
    {},
    { newAddress: PROPOSED_ADDRESSES[1] },
  ],
});

// Rejected rotation on member #2 with a per-slot comment + request reason.
export const rejectedRequest = mockRotationRequest({
  status: 'REJECTED',
  slots: [{}, { newAddress: PROPOSED_ADDRESSES[0] }, {}, {}],
  comments: {
    reason: 'Cluster composition does not meet the eligibility criteria',
    slots: [null, 'Signature does not match the provided address', null, null],
  },
});

// From-scratch (uninitialized operator) request with all 4 slots proposed.
const fromScratchSlots: RotationRequestDto['slots'] = [
  { newAddress: ACTIVE_ADDRESSES[0], discordHandle: 'memberOne' },
  { newAddress: ACTIVE_ADDRESSES[1], telegramUsername: 'memberTwo' },
  { newAddress: ACTIVE_ADDRESSES[2] },
  { newAddress: ACTIVE_ADDRESSES[3] },
];

export const initReviewRequest = mockRotationRequest({
  slots: fromScratchSlots,
});

export const initRejectedRequest = mockRotationRequest({
  status: 'REJECTED',
  slots: fromScratchSlots,
  comments: {
    reason: 'Duplicate cluster detected',
    slots: [null, null, 'Address is used by another cluster', null],
  },
});
