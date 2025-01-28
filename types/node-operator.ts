import { ROLES } from 'consts/roles';
import { BigNumber, BytesLike } from 'ethers';

// BigNumber -> string
export type NodeOperatorId = `${number}`;

export type NodeOperator = {
  id: NodeOperatorId;
  roles: ROLES[];
};

export type NodeOperatorRoles = {
  id: NodeOperatorId;
  manager?: boolean;
  rewards?: boolean;
};

export type NodeOperatorInvite = {
  id: NodeOperatorId;
  role: ROLES;
};

export type Proof = BytesLike[];

export type BondBalance = {
  current: BigNumber;
  required: BigNumber;
  locked: BigNumber;

  delta: BigNumber;
  isInsufficient: boolean;
};

export type RewardProof = {
  shares: BigNumber;
  proof: Proof;
};

export type RewardsBalance = RewardProof & {
  available: BigNumber;
};
