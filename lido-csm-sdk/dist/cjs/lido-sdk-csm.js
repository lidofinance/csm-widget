"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LidoSDKCsm = void 0;
const accounting_sdk_js_1 = require("./accounting-sdk/accounting-sdk.js");
const bond_sdk_js_1 = require("./bond-sdk/bond-sdk.js");
const bus_registry_js_1 = require("./common/class-primitives/bus-registry.js");
const core_sdk_js_1 = require("./core-sdk/core-sdk.js");
const events_sdk_js_1 = require("./events-sdk/events-sdk.js");
const keys_sdk_js_1 = require("./keys-sdk/keys-sdk.js");
const module_sdk_js_1 = require("./module-sdk/module-sdk.js");
const operator_sdk_js_1 = require("./operator-sdk/operator-sdk.js");
const parameters_sdk_js_1 = require("./parameters-sdk/parameters-sdk.js");
const permissionless_gate_sdk_js_1 = require("./permissionless-gate-sdk/permissionless-gate-sdk.js");
const rewards_sdk_js_1 = require("./rewards-sdk/rewards-sdk.js");
const roles_sdk_js_1 = require("./roles-sdk/roles-sdk.js");
const spending_sdk_js_1 = require("./spending-sdk/spending-sdk.js");
const staking_router_sdk_js_1 = require("./staking-router-sdk/staking-router-sdk.js");
class LidoSDKCsm {
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
        const bus = new bus_registry_js_1.BusRegistry();
        this.core = new core_sdk_js_1.CoreSDK(props);
        const commonProps = { ...props, core: this.core, bus };
        this.spending = new spending_sdk_js_1.SpendingSDK(commonProps, 'spending');
        this.module = new module_sdk_js_1.ModuleSDK(commonProps);
        this.accounting = new accounting_sdk_js_1.AccountingSDK(commonProps);
        this.parameters = new parameters_sdk_js_1.ParametersSDK(commonProps, 'parameters');
        this.operator = new operator_sdk_js_1.OperatorSDK(commonProps);
        this.rewards = new rewards_sdk_js_1.RewardsSDK(commonProps);
        this.keys = new keys_sdk_js_1.KeysSDK(commonProps);
        this.bond = new bond_sdk_js_1.BondSDK(commonProps);
        this.roles = new roles_sdk_js_1.RolesSDK(commonProps);
        this.events = new events_sdk_js_1.EventsSDK(commonProps, 'events');
        this.permissionlessGate = new permissionless_gate_sdk_js_1.PermissionlessGateSDK(commonProps);
        this.stakingRouter = new staking_router_sdk_js_1.StakingRouterSDK(commonProps);
    }
}
exports.LidoSDKCsm = LidoSDKCsm;
//# sourceMappingURL=lido-sdk-csm.js.map