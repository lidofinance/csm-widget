import { AccountingSDK } from './accounting-sdk/accounting-sdk.js';
import { BondSDK } from './bond-sdk/bond-sdk.js';
import { BusRegistry } from './common/class-primitives/bus-registry.js';
import { CoreSDK } from './core-sdk/core-sdk.js';
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
export class LidoSDKCsm {
    constructor(props) {
        Object.defineProperty(this, "core", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "spending", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "module", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "accounting", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "parameters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "operator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "rewards", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "keys", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "bond", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "roles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "permissionlessGate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "stakingRouter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const bus = new BusRegistry();
        this.core = new CoreSDK(props);
        const commonProps = { ...props, core: this.core, bus };
        this.spending = new SpendingSDK(commonProps, 'spending');
        this.module = new ModuleSDK(commonProps);
        this.accounting = new AccountingSDK(commonProps);
        this.parameters = new ParametersSDK(commonProps, 'parameters');
        this.operator = new OperatorSDK(commonProps);
        this.rewards = new RewardsSDK(commonProps);
        this.keys = new KeysSDK(commonProps);
        this.bond = new BondSDK(commonProps);
        this.roles = new RolesSDK(commonProps);
        this.events = new EventsSDK(commonProps);
        this.permissionlessGate = new PermissionlessGateSDK(commonProps);
        this.stakingRouter = new StakingRouterSDK(commonProps);
    }
}
//# sourceMappingURL=lido-sdk-csm.js.map