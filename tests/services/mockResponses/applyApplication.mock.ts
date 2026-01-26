export const applicationStatus = {
  REVIEW: 'REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

type ApplyApplicationMockResponse = {
  form: {
    mainAddress: `0x${string}` | null;
    twitterLink: string | null;
    discordLink: string | null;
    additionalAddresses: (`0x${string}` | null)[] | null;
  };
  status: keyof typeof applicationStatus;
  issued: boolean;
  comments: {
    reason: string | null;
    mainAddress: string | null;
    twitterLink: string | null;
    discordLink: string | null;
    additionalAddresses: (`0x${string}` | null)[] | null;
  };
  scores: {
    ethStaker: number | null;
    stakeCat: number | null;
    obolTechne: number | null;
    ssvVerified: number | null;
    csmTestnet: number | null;
    csmMainnet: number | null;
    sdvtTestnet: number | null;
    sdvtMainnet: number | null;
    humanPassport: number | null;
    circles: number | null;
    discord: number | null;
    twitter: number | null;
    aragonVotes: number | null;
    snapshotVotes: number | null;
    lidoGalxe: number | null;
    highSignal: number | null;
    gitPoaps: number | null;
  };
  createdAt: string;
  updatedAt: string;
};

export const applyApplicationMockResponse: ApplyApplicationMockResponse = {
  form: {
    mainAddress: null,
    twitterLink: null,
    discordLink: null,
    additionalAddresses: null,
  },
  status: 'REVIEW',
  issued: false,
  comments: {
    reason: null,
    mainAddress: null,
    twitterLink: null,
    discordLink: null,
    additionalAddresses: null,
  },
  scores: {
    ethStaker: null,
    stakeCat: null,
    obolTechne: null,
    ssvVerified: null,
    csmTestnet: null,
    csmMainnet: null,
    sdvtTestnet: null,
    sdvtMainnet: null,
    humanPassport: null,
    circles: null,
    discord: null,
    twitter: null,
    aragonVotes: null,
    snapshotVotes: null,
    lidoGalxe: null,
    highSignal: null,
    gitPoaps: null,
  },
  createdAt: '2026-01-15T09:10:11.441Z',
  updatedAt: '2026-01-15T10:55:58.812Z',
};
