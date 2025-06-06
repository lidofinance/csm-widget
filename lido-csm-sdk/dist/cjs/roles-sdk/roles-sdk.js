"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesSDK = void 0;
const lido_ethereum_sdk_1 = require("@lidofinance/lido-ethereum-sdk");
const csm_sdk_module_js_1 = require("../common/class-primitives/csm-sdk-module.js");
const index_js_1 = require("../common/decorators/index.js");
const index_js_2 = require("../common/index.js");
let RolesSDK = (() => {
    var _a;
    let _classSuper = csm_sdk_module_js_1.CsmSDKModule;
    let _instanceExtraInitializers = [];
    let _changeRewardsRole_decorators;
    let _proposeManagerRole_decorators;
    let _proposeRewardsRole_decorators;
    let _resetManagerRole_decorators;
    let _confirmRewardsRole_decorators;
    let _confirmManagerRole_decorators;
    return _a = class RolesSDK extends _classSuper {
            get contract() {
                return this.core.getContractCSModule();
            }
            async changeRewardsRole(props) {
                const { nodeOperatorId, address, ...rest } = props;
                const args = [nodeOperatorId, address];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.changeNodeOperatorRewardAddress(args, {
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.changeNodeOperatorRewardAddress(args, {
                        ...options,
                    }),
                });
            }
            async proposeManagerRole(props) {
                const { nodeOperatorId, address, ...rest } = props;
                const args = [nodeOperatorId, address];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.proposeNodeOperatorManagerAddressChange(args, {
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.proposeNodeOperatorManagerAddressChange(args, {
                        ...options,
                    }),
                });
            }
            async proposeRewardsRole(props) {
                const { nodeOperatorId, address, ...rest } = props;
                const args = [nodeOperatorId, address];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.proposeNodeOperatorRewardAddressChange(args, {
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.proposeNodeOperatorRewardAddressChange(args, {
                        ...options,
                    }),
                });
            }
            async resetManagerRole(props) {
                const { nodeOperatorId, ...rest } = props;
                const args = [nodeOperatorId];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.resetNodeOperatorManagerAddress(args, {
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.resetNodeOperatorManagerAddress(args, {
                        ...options,
                    }),
                });
            }
            async confirmRewardsRole(props) {
                const { nodeOperatorId, ...rest } = props;
                const args = [nodeOperatorId];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.confirmNodeOperatorRewardAddressChange(args, {
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.confirmNodeOperatorRewardAddressChange(args, {
                        ...options,
                    }),
                });
            }
            async confirmManagerRole(props) {
                const { nodeOperatorId, ...rest } = props;
                const args = [nodeOperatorId];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.confirmNodeOperatorManagerAddressChange(args, {
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.confirmNodeOperatorManagerAddressChange(args, {
                        ...options,
                    }),
                });
            }
            async confirmRole(props) {
                const { role } = props;
                switch (role) {
                    case index_js_2.ROLES.MANAGER:
                        return this.confirmManagerRole(props);
                    case index_js_2.ROLES.REWARDS:
                        return this.confirmRewardsRole(props);
                    default:
                        throw new lido_ethereum_sdk_1.SDKError({
                            message: 'unsupported role',
                            code: lido_ethereum_sdk_1.ERROR_CODE.INVALID_ARGUMENT,
                        });
                }
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _changeRewardsRole_decorators = [(0, index_js_1.Logger)('Call:'), (0, index_js_1.ErrorHandler)()];
            _proposeManagerRole_decorators = [(0, index_js_1.Logger)('Call:'), (0, index_js_1.ErrorHandler)()];
            _proposeRewardsRole_decorators = [(0, index_js_1.Logger)('Call:'), (0, index_js_1.ErrorHandler)()];
            _resetManagerRole_decorators = [(0, index_js_1.Logger)('Call:'), (0, index_js_1.ErrorHandler)()];
            _confirmRewardsRole_decorators = [(0, index_js_1.Logger)('Call:'), (0, index_js_1.ErrorHandler)()];
            _confirmManagerRole_decorators = [(0, index_js_1.Logger)('Call:'), (0, index_js_1.ErrorHandler)()];
            __esDecorate(_a, null, _changeRewardsRole_decorators, { kind: "method", name: "changeRewardsRole", static: false, private: false, access: { has: obj => "changeRewardsRole" in obj, get: obj => obj.changeRewardsRole }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _proposeManagerRole_decorators, { kind: "method", name: "proposeManagerRole", static: false, private: false, access: { has: obj => "proposeManagerRole" in obj, get: obj => obj.proposeManagerRole }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _proposeRewardsRole_decorators, { kind: "method", name: "proposeRewardsRole", static: false, private: false, access: { has: obj => "proposeRewardsRole" in obj, get: obj => obj.proposeRewardsRole }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _resetManagerRole_decorators, { kind: "method", name: "resetManagerRole", static: false, private: false, access: { has: obj => "resetManagerRole" in obj, get: obj => obj.resetManagerRole }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _confirmRewardsRole_decorators, { kind: "method", name: "confirmRewardsRole", static: false, private: false, access: { has: obj => "confirmRewardsRole" in obj, get: obj => obj.confirmRewardsRole }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _confirmManagerRole_decorators, { kind: "method", name: "confirmManagerRole", static: false, private: false, access: { has: obj => "confirmManagerRole" in obj, get: obj => obj.confirmManagerRole }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RolesSDK = RolesSDK;
//# sourceMappingURL=roles-sdk.js.map