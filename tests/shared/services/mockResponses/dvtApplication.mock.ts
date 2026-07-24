export const dvtApplicationStatus = {
  REVIEW: 'REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type DvtStatusMockResponse = {
  form: {
    mainAddress: string;
    discordLink?: string;
    telegramUsername?: string;
    clusterMembers: {
      address: string;
      discordHandle?: string | null;
      telegramUsername?: string | null;
    }[];
  };
  status: keyof typeof dvtApplicationStatus;
  boundToNodeOperatorId: number | null;
  comments: {
    reason?: string;
    mainAddress?: string;
    discordLink?: string;
    telegramUsername?: string;
    clusterMembers?: (string | null)[];
  };
  createdAt: string;
  updatedAt: string | null;
};

const defaults: DvtStatusMockResponse = {
  form: {
    mainAddress: '0xbc441b7c650f2dc3514cb5f39fb8efb3cc03cb22',
    discordLink: 'https://discord.com/channels/123/456/789',
    clusterMembers: [
      { address: '0x2c71755ed6c5be0d35a893cfab253f5291a512d8' },
      { address: '0xa6fc0e8ec1be92b5786baf4f5ecb9a453d527067' },
      { address: '0x134ca9328f6b4b2564d58af2904804c73385d015' },
      { address: '0x649d105904ea2f14073bc34a173486644705aada' },
    ],
  },
  status: 'REVIEW',
  boundToNodeOperatorId: null,
  comments: {},
  createdAt: '2026-06-19T16:39:46.629Z',
  updatedAt: '2026-06-24T16:51:07.018Z',
};

export const buildDvtStatusResponse = (
  overrides: Partial<DvtStatusMockResponse> = {},
): DvtStatusMockResponse => ({
  ...defaults,
  ...overrides,
  form: { ...defaults.form, ...overrides.form },
  comments: { ...defaults.comments, ...overrides.comments },
});
