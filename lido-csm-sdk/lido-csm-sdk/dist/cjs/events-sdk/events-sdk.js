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
exports.EventsSDK = void 0;
const CSModuleV1Events_js_1 = require("../abi/CSModuleV1Events.js");
const csm_sdk_module_js_1 = require("../common/class-primitives/csm-sdk-module.js");
const index_js_1 = require("../common/decorators/index.js");
const index_js_2 = require("../common/index.js");
const request_with_block_step_js_1 = require("../common/utils/request-with-block-step.js");
const reconstruct_invites_js_1 = require("./reconstruct-invites.js");
const reconstruct_operators_js_1 = require("./reconstruct-operators.js");
let EventsSDK = (() => {
    var _a;
    let _classSuper = csm_sdk_module_js_1.CsmSDKModule;
    let _instanceExtraInitializers = [];
    let _getNodeOperatorsByAddress_decorators;
    let _getInvitesByAddress_decorators;
    let _parseEventsProps_decorators;
    return _a = class EventsSDK extends _classSuper {
            get contract() {
                return this.core.getContractCSModule();
            }
            get contractV1Events() {
                return this.core.getContract(index_js_2.CSM_CONTRACT_NAMES.csModule, CSModuleV1Events_js_1.CSModulev1EventsAbi);
            }
            async getNodeOperatorsByAddress(address, options) {
                const stepConfig = await this.parseEventsProps(options);
                const logResults = await Promise.all([
                    ...(0, request_with_block_step_js_1.requestWithBlockStep)(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorAdded({ managerAddress: address }, stepProps)),
                    ...(0, request_with_block_step_js_1.requestWithBlockStep)(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorAdded({ rewardAddress: address }, stepProps)),
                    ...(0, request_with_block_step_js_1.requestWithBlockStep)(stepConfig, (stepProps) => this.contractV1Events.getEvents.NodeOperatorAdded({ managerAddress: address }, stepProps)),
                    ...(0, request_with_block_step_js_1.requestWithBlockStep)(stepConfig, (stepProps) => this.contractV1Events.getEvents.NodeOperatorAdded({ rewardAddress: address }, stepProps)),
                    ...(0, request_with_block_step_js_1.requestWithBlockStep)(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorManagerAddressChanged({ oldAddress: address }, stepProps)),
                    ...(0, request_with_block_step_js_1.requestWithBlockStep)(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorManagerAddressChanged({ newAddress: address }, stepProps)),
                    ...(0, request_with_block_step_js_1.requestWithBlockStep)(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorRewardAddressChanged({ oldAddress: address }, stepProps)),
                    ...(0, request_with_block_step_js_1.requestWithBlockStep)(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorRewardAddressChanged({ newAddress: address }, stepProps)),
                ]);
                const logs = logResults.flat();
                return (0, reconstruct_operators_js_1.reconstructOperators)(logs, address);
            }
            async getInvitesByAddress(address, options) {
                const stepConfig = await this.parseEventsProps(options);
                const logResults = await Promise.all([
                    ...(0, request_with_block_step_js_1.requestWithBlockStep)(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorManagerAddressChanged({ newAddress: address }, stepProps)),
                    ...(0, request_with_block_step_js_1.requestWithBlockStep)(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorRewardAddressChanged({ newAddress: address }, stepProps)),
                    ...(0, request_with_block_step_js_1.requestWithBlockStep)(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorManagerAddressChangeProposed({ oldProposedAddress: address }, stepProps)),
                    ...(0, request_with_block_step_js_1.requestWithBlockStep)(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorRewardAddressChangeProposed({ oldProposedAddress: address }, stepProps)),
                    ...(0, request_with_block_step_js_1.requestWithBlockStep)(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorManagerAddressChangeProposed({ newProposedAddress: address }, stepProps)),
                    ...(0, request_with_block_step_js_1.requestWithBlockStep)(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorRewardAddressChangeProposed({ newProposedAddress: address }, stepProps)),
                ]);
                const logs = logResults.flat();
                return (0, reconstruct_invites_js_1.reconstructInvites)(logs, address);
            }
            async parseEventsProps(props) {
                const step = props?.step ?? 1_000_000;
                const toBlock = await this.core.core.toBlockNumber({
                    block: props?.toBlock ?? 'latest',
                });
                const fromBlock = props?.fromBlock
                    ? await this.core.core.toBlockNumber({
                        block: props.fromBlock ?? 'latest',
                    })
                    : index_js_2.DEPLOYMENT_BLOCK_NUMBER_BY_CHAIN[this.core.chainId] ??
                        toBlock - BigInt(step);
                return {
                    fromBlock,
                    toBlock,
                    step,
                };
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _getNodeOperatorsByAddress_decorators = [(0, index_js_1.Logger)('Events:'), (0, index_js_1.ErrorHandler)()];
            _getInvitesByAddress_decorators = [(0, index_js_1.Logger)('Events:'), (0, index_js_1.ErrorHandler)()];
            _parseEventsProps_decorators = [(0, index_js_1.Logger)('Utils:'), (0, index_js_1.ErrorHandler)()];
            __esDecorate(_a, null, _getNodeOperatorsByAddress_decorators, { kind: "method", name: "getNodeOperatorsByAddress", static: false, private: false, access: { has: obj => "getNodeOperatorsByAddress" in obj, get: obj => obj.getNodeOperatorsByAddress }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getInvitesByAddress_decorators, { kind: "method", name: "getInvitesByAddress", static: false, private: false, access: { has: obj => "getInvitesByAddress" in obj, get: obj => obj.getInvitesByAddress }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _parseEventsProps_decorators, { kind: "method", name: "parseEventsProps", static: false, private: false, access: { has: obj => "parseEventsProps" in obj, get: obj => obj.parseEventsProps }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.EventsSDK = EventsSDK;
//# sourceMappingURL=events-sdk.js.map