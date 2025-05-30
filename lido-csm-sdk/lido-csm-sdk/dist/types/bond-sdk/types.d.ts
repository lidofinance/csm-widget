import { NodeOperatorId, RewardProof } from '../common/index.js';
import { CommonTransactionProps, PermitSignature } from '../core-sdk/types.js';
export type AddBondResult = {
  current: bigint;
  required: bigint;
};
export type AddBondProps = CommonTransactionProps<AddBondResult> & {
  nodeOperatorId: NodeOperatorId;
  amount: bigint;
  permit?: PermitSignature;
};
export type CoverLockedBondProps = CommonTransactionProps<bigint> & {
  nodeOperatorId: NodeOperatorId;
  amount: bigint;
};
export type ClaimBondProps = CommonTransactionProps &
  Partial<RewardProof> & {
    nodeOperatorId: NodeOperatorId;
    amount: bigint;
  };
export type PullRewardsProps = Omit<ClaimBondProps, 'amount'>;
//# sourceMappingURL=types.d.ts.map
