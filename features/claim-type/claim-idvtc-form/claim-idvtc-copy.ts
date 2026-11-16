export type ClaimIdvtcCopy = {
  title: string;
  description: string;
  cta: string;
};

const TITLE = 'Claim Identified DVT Cluster operator type';

export const getClaimIdvtcCopy = (isCurrentIcs: boolean): ClaimIdvtcCopy =>
  isCurrentIcs
    ? {
        title: TITLE,
        description:
          'You are eligible to claim a new operator type. Choose the option you prefer. Claiming the Identified Community Staker operator type will change some parameters for your Node Operator according to the section below.',
        cta: 'Upgrade ICS to IDVTC',
      }
    : {
        title: TITLE,
        description:
          'You are eligible to claim a new operator type. Claiming the Identified DVT Cluster operator type will change some parameters for your node operator according to the section below.',
        cta: 'Claim operator type',
      };
