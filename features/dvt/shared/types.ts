export type DvtFormStatus = 'APPROVED' | 'REJECTED' | 'REVIEW';

export type DvtClusterMemberDto = {
  address: string;
  signature: string;
  discordHandle?: string;
  telegramUsername?: string;
};

export type DvtApplyDto = {
  mainAddress: string;
  discordLink: string;
  telegramUsername?: string;
  clusterMembers: DvtClusterMemberDto[];
};

export type DvtFormDataDto = {
  mainAddress: string;
  discordLink: string;
  telegramUsername?: string;
  clusterMembers: {
    address: string;
    discordHandle?: string;
    telegramUsername?: string;
  }[];
};

export type DvtCommentsDto = {
  reason?: string;
  mainAddress?: string;
  discordLink?: string;
  telegramUsername?: string;
  clusterMembers?: (string | null)[];
};

export type DvtResponseDto = {
  form: DvtFormDataDto;
  status: DvtFormStatus;
  issued: boolean;
  comments: DvtCommentsDto;
  createdAt: string;
  updatedAt: string | null;
};
