import { TransactionResult } from '@lidofinance/lido-ethereum-sdk';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { ChangeRoleProps, ConfirmRoleProps, ResetRoleProps, WithRole } from './types.js';
export declare class RolesSDK extends CsmSDKModule {
    private get contract();
    changeRewardsRole(props: ChangeRoleProps): Promise<TransactionResult>;
    proposeManagerRole(props: ChangeRoleProps): Promise<TransactionResult>;
    proposeRewardsRole(props: ChangeRoleProps): Promise<TransactionResult>;
    resetManagerRole(props: ResetRoleProps): Promise<TransactionResult>;
    confirmRewardsRole(props: ConfirmRoleProps): Promise<TransactionResult>;
    confirmManagerRole(props: ConfirmRoleProps): Promise<TransactionResult>;
    confirmRole(props: WithRole<ConfirmRoleProps>): Promise<TransactionResult>;
}
//# sourceMappingURL=roles-sdk.d.ts.map