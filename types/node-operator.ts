import { BytesLike } from 'ethers';

// BigNumber -> string
export type NodeOperatorId = string;

export type NodeOperatorRoles = {
  id: NodeOperatorId;
  manager?: boolean;
  rewards?: boolean;
};

export type NodeOperatorInvite =
  | NodeOperatorManagerInvite
  | NodeOperatorRewardsInvite;

type NodeOperatorManagerInvite = {
  id: NodeOperatorId;
  manager: true;
  rewards?: false;
};
type NodeOperatorRewardsInvite = {
  id: NodeOperatorId;
  manager?: false;
  rewards: true;
};

export type Proof = BytesLike[];
