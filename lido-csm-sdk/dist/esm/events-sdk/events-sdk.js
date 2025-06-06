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
import { CSModulev1EventsAbi } from '../abi/CSModuleV1Events.js';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { ErrorHandler, Logger } from '../common/decorators/index.js';
import { CSM_CONTRACT_NAMES, DEPLOYMENT_BLOCK_NUMBER_BY_CHAIN, } from '../common/index.js';
import { requestWithBlockStep } from '../common/utils/request-with-block-step.js';
import { reconstructInvites } from './reconstruct-invites.js';
import { reconstructOperators } from './reconstruct-operators.js';
import { sortEventsByBlockNumber } from '../common/utils/sort-events.js';
let EventsSDK = (() => {
    var _a;
    let _classSuper = CsmSDKModule;
    let _instanceExtraInitializers = [];
    let _getNodeOperatorsByAddress_decorators;
    let _getInvitesByAddress_decorators;
    let _getRewardsReports_decorators;
    let _parseEventsProps_decorators;
    return _a = class EventsSDK extends _classSuper {
            get contract() {
                return this.core.getContractCSModule();
            }
            get contractV1Events() {
                return this.core.getContract(CSM_CONTRACT_NAMES.csModule, CSModulev1EventsAbi);
            }
            get oracleContract() {
                return this.core.getContractCSFeeOracle();
            }
            async getNodeOperatorsByAddress(address, options) {
                const stepConfig = await this.parseEventsProps(options);
                const logResults = await Promise.all([
                    ...requestWithBlockStep(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorAdded({ managerAddress: address }, stepProps)),
                    ...requestWithBlockStep(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorAdded({ rewardAddress: address }, stepProps)),
                    ...requestWithBlockStep(stepConfig, (stepProps) => this.contractV1Events.getEvents.NodeOperatorAdded({ managerAddress: address }, stepProps)),
                    ...requestWithBlockStep(stepConfig, (stepProps) => this.contractV1Events.getEvents.NodeOperatorAdded({ rewardAddress: address }, stepProps)),
                    ...requestWithBlockStep(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorManagerAddressChanged({ oldAddress: address }, stepProps)),
                    ...requestWithBlockStep(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorManagerAddressChanged({ newAddress: address }, stepProps)),
                    ...requestWithBlockStep(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorRewardAddressChanged({ oldAddress: address }, stepProps)),
                    ...requestWithBlockStep(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorRewardAddressChanged({ newAddress: address }, stepProps)),
                ]);
                const logs = logResults.flat().sort(sortEventsByBlockNumber);
                return reconstructOperators(logs, address);
            }
            async getInvitesByAddress(address, options) {
                const stepConfig = await this.parseEventsProps(options);
                const logResults = await Promise.all([
                    ...requestWithBlockStep(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorManagerAddressChanged({ newAddress: address }, stepProps)),
                    ...requestWithBlockStep(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorRewardAddressChanged({ newAddress: address }, stepProps)),
                    ...requestWithBlockStep(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorManagerAddressChangeProposed({ oldProposedAddress: address }, stepProps)),
                    ...requestWithBlockStep(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorRewardAddressChangeProposed({ oldProposedAddress: address }, stepProps)),
                    ...requestWithBlockStep(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorManagerAddressChangeProposed({ newProposedAddress: address }, stepProps)),
                    ...requestWithBlockStep(stepConfig, (stepProps) => this.contract.getEvents.NodeOperatorRewardAddressChangeProposed({ newProposedAddress: address }, stepProps)),
                ]);
                const logs = logResults.flat().sort(sortEventsByBlockNumber);
                return reconstructInvites(logs, address);
            }
            async getRewardsReports(options) {
                const stepConfig = await this.parseEventsProps(options);
                const logResults = await Promise.all(requestWithBlockStep(stepConfig, (stepProps) => this.oracleContract.getEvents.ProcessingStarted(undefined, stepProps)));
                const logs = logResults.flat().sort(sortEventsByBlockNumber);
                return logs;
            }
            async parseEventsProps(props) {
                // FIXME: const 20K and param
                const step = props?.step ?? 1_000_000;
                const toBlock = await this.core.core.toBlockNumber({
                    block: props?.toBlock ?? 'latest',
                });
                const fromBlock = props?.fromBlock
                    ? await this.core.core.toBlockNumber({
                        block: props.fromBlock ?? 'latest',
                    })
                    : DEPLOYMENT_BLOCK_NUMBER_BY_CHAIN[this.core.chainId] ??
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
            _getNodeOperatorsByAddress_decorators = [Logger('Events:'), ErrorHandler()];
            _getInvitesByAddress_decorators = [Logger('Events:'), ErrorHandler()];
            _getRewardsReports_decorators = [Logger('Events:'), ErrorHandler()];
            _parseEventsProps_decorators = [Logger('Utils:'), ErrorHandler()];
            __esDecorate(_a, null, _getNodeOperatorsByAddress_decorators, { kind: "method", name: "getNodeOperatorsByAddress", static: false, private: false, access: { has: obj => "getNodeOperatorsByAddress" in obj, get: obj => obj.getNodeOperatorsByAddress }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getInvitesByAddress_decorators, { kind: "method", name: "getInvitesByAddress", static: false, private: false, access: { has: obj => "getInvitesByAddress" in obj, get: obj => obj.getInvitesByAddress }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getRewardsReports_decorators, { kind: "method", name: "getRewardsReports", static: false, private: false, access: { has: obj => "getRewardsReports" in obj, get: obj => obj.getRewardsReports }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _parseEventsProps_decorators, { kind: "method", name: "parseEventsProps", static: false, private: false, access: { has: obj => "parseEventsProps" in obj, get: obj => obj.parseEventsProps }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { EventsSDK };
//# sourceMappingURL=events-sdk.js.map