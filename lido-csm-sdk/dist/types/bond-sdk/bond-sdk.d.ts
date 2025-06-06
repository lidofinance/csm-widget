import { TransactionResult } from '@lidofinance/lido-ethereum-sdk';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { RewardProof, WithToken } from '../common/index.js';
import { SpendingSDK } from '../spending-sdk/spending-sdk.js';
import { AddBondProps, AddBondResult, ClaimBondProps, CoverLockedBondProps, PullRewardsProps } from './types.js';
export declare class BondSDK extends CsmSDKModule<{
    spending: SpendingSDK;
}> {
    private get contract();
    private getBondSummary;
    addBondETH(props: AddBondProps): Promise<TransactionResult<AddBondResult>>;
    addBondStETH(props: AddBondProps): Promise<TransactionResult<AddBondResult>>;
    addBondWstETH(props: AddBondProps): Promise<TransactionResult<AddBondResult>>;
    addBond(props: WithToken<AddBondProps>): Promise<TransactionResult<AddBondResult>>;
    private getPermit;
    coverLockedBond(props: CoverLockedBondProps): Promise<TransactionResult<bigint>>;
    private coverReceiptParseEvents;
    parseClaimProps<T>(props: T & Partial<RewardProof>): T & RewardProof;
    pullRewards(props: PullRewardsProps): Promise<TransactionResult>;
    claimBondUnstETH(props: ClaimBondProps): Promise<TransactionResult>;
    claimBondStETH(props: ClaimBondProps): Promise<TransactionResult>;
    claimBondWstETH(props: ClaimBondProps): Promise<TransactionResult>;
    claimBond(props: WithToken<ClaimBondProps>): Promise<TransactionResult>;
}
//# sourceMappingURL=bond-sdk.d.ts.map