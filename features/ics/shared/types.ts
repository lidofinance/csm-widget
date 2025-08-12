export type IcsFormStatus = 'APPROVED' | 'REJECTED' | 'REVIEW';

export type IcsFormDataDto = {
  mainAddress: string;
  twitterLink?: string;
  discordLink?: string;
  additionalAddresses?: string[];
};

export type IcsCommentsDto = {
  mainAddress?: string;
  twitterLink?: string;
  discordLink?: string;
  additionalAddresses?: string[];
};

export type ProofOfExperienceDto = {
  ethStaker?: number;
  stakeCat?: number;
  obolTechne?: number;
  ssvVerified?: number;
  csmTestnet?: number;
  csmMainnet?: number;
  sdvtTestnet?: number;
  sdvtMainnet?: number;
};

export type ProofOfHumanityDto = {
  humanPassport?: number;
  circles?: number;
  discord?: number;
  twitter?: number;
};

export type ProofOfEngagementDto = {
  aragonVotes?: number;
  snapshotVotes?: number;
  lidoGalxe?: number;
  highSignal?: number;
  gitPoaps?: number;
};

export type IcsScoresDto = {
  proofOfExperience: ProofOfExperienceDto;
  proofOfHumanity: ProofOfHumanityDto;
  proofOfEngagement: ProofOfEngagementDto;
};

export type IcsResponseDto = {
  form: IcsFormDataDto;
  status: IcsFormStatus;
  comments: IcsCommentsDto;
  scores: IcsScoresDto;
};

export type IcsAdditionalAddressDto = {
  address: string;
  signature: string;
};

export type IcsApplyDto = {
  mainAddress: string;
  additionalAddresses?: IcsAdditionalAddressDto[];
  twitterLink?: string;
  discordLink?: string;
};
