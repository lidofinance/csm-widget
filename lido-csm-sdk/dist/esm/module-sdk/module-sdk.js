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
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { ErrorHandler, Logger } from '../common/decorators/index.js';
import { CSM_CONTRACT_NAMES, SUPPORTED_VERSION_BY_CONTRACT, } from '../common/index.js';
import { onError } from './on-error.js';
let ModuleSDK = (() => {
    var _a;
    let _classSuper = CsmSDKModule;
    let _instanceExtraInitializers = [];
    let _getStatus_decorators;
    let _getVersions_decorators;
    let _getOperatorsCount_decorators;
    let _getQueues_decorators;
    return _a = class ModuleSDK extends _classSuper {
            get contract() {
                return this.core.getContractCSModule();
            }
            async getStatus() {
                const csAccounting = this.core.getContractCSAccounting();
                const csModule = this.core.getContractCSModule();
                const [isPausedModule, isPausedAccounting] = await Promise.all([
                    csModule.read.isPaused(),
                    csAccounting.read.isPaused(),
                ]);
                return {
                    isPausedModule,
                    isPausedAccounting,
                };
            }
            async getVersions() {
                const csAccounting = this.core.getContractCSAccounting();
                const csModule = this.core.getContractCSModule();
                const csFeeDistributor = this.core.getContractCSFeeDistributor();
                const [module, accounting, feeDistributor] = await Promise.all([
                    csModule.read.getInitializedVersion().catch(onError),
                    csAccounting.read.getInitializedVersion().catch(onError),
                    csFeeDistributor.read.getInitializedVersion().catch(onError),
                ]);
                return {
                    [CSM_CONTRACT_NAMES.csModule]: module,
                    [CSM_CONTRACT_NAMES.csAccounting]: accounting,
                    [CSM_CONTRACT_NAMES.csFeeDistributor]: feeDistributor,
                };
            }
            async isVersionsSupported() {
                const versions = await this.getVersions();
                return Object.keys(versions)
                    .map((key) => SUPPORTED_VERSION_BY_CONTRACT[key] >=
                    versions[key])
                    .every(Boolean);
            }
            async getOperatorsCount() {
                return this.contract.read.getNodeOperatorsCount();
            }
            async getQueues() {
                const queuesCount = await this.contract.read.QUEUE_LOWEST_PRIORITY();
                const pointers = await Promise.all(Array.from({ length: Number(queuesCount) }, (_, i) => this.contract.read.depositQueuePointers([BigInt(i)])));
                return pointers.map(([head, tail]) => ({ head, tail }));
            }
            async hasRole(address, role) {
                return this.contract.read.hasRole([role, address]);
            }
            async hasReportStealingRole(address) {
                const role = await this.contract.read.REPORT_EL_REWARDS_STEALING_PENALTY_ROLE();
                return this.hasRole(address, role);
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _getStatus_decorators = [Logger('Views:'), ErrorHandler()];
            _getVersions_decorators = [Logger('Views:'), ErrorHandler()];
            _getOperatorsCount_decorators = [Logger('Views:'), ErrorHandler()];
            _getQueues_decorators = [Logger('Views:'), ErrorHandler()];
            __esDecorate(_a, null, _getStatus_decorators, { kind: "method", name: "getStatus", static: false, private: false, access: { has: obj => "getStatus" in obj, get: obj => obj.getStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getVersions_decorators, { kind: "method", name: "getVersions", static: false, private: false, access: { has: obj => "getVersions" in obj, get: obj => obj.getVersions }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getOperatorsCount_decorators, { kind: "method", name: "getOperatorsCount", static: false, private: false, access: { has: obj => "getOperatorsCount" in obj, get: obj => obj.getOperatorsCount }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getQueues_decorators, { kind: "method", name: "getQueues", static: false, private: false, access: { has: obj => "getQueues" in obj, get: obj => obj.getQueues }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { ModuleSDK };
//# sourceMappingURL=module-sdk.js.map