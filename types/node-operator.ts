import { BigNumber, BytesLike } from 'ethers';

// BigNumber -> string
export type NodeOperatorId = `${number}`;

export type NodeOperatorRolesProps = {
  manager?: boolean;
  rewards?: boolean;
};

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

export type BondBalance = {
  current: BigNumber;
  required: BigNumber;
};
