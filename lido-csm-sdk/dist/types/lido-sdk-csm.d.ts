import { AccountingSDK } from './accounting-sdk/accounting-sdk.js';
import { BondSDK } from './bond-sdk/bond-sdk.js';
import { CoreSDK } from './core-sdk/core-sdk.js';
import { CsmCoreProps } from './core-sdk/types.js';
import { EventsSDK } from './events-sdk/events-sdk.js';
import { KeysSDK } from './keys-sdk/keys-sdk.js';
import { ModuleSDK } from './module-sdk/module-sdk.js';
import { OperatorSDK } from './operator-sdk/operator-sdk.js';
import { ParametersSDK } from './parameters-sdk/parameters-sdk.js';
import { PermissionlessGateSDK } from './permissionless-gate-sdk/permissionless-gate-sdk.js';
import { RewardsSDK } from './rewards-sdk/rewards-sdk.js';
import { RolesSDK } from './roles-sdk/roles-sdk.js';
import { SpendingSDK } from './spending-sdk/spending-sdk.js';
import { StakingRouterSDK } from './staking-router-sdk/staking-router-sdk.js';
export declare class LidoSDKCsm {
    readonly core: CoreSDK;
    readonly spending: SpendingSDK;
    readonly module: ModuleSDK;
    readonly accounting: AccountingSDK;
    readonly parameters: ParametersSDK;
    readonly operator: OperatorSDK;
    readonly rewards: RewardsSDK;
    readonly keys: KeysSDK;
    readonly bond: BondSDK;
    readonly roles: RolesSDK;
    readonly permissionlessGate: PermissionlessGateSDK;
    readonly stakingRouter: StakingRouterSDK;
    readonly events: EventsSDK;
    constructor(props: CsmCoreProps);
}
//# sourceMappingURL=lido-sdk-csm.d.ts.map