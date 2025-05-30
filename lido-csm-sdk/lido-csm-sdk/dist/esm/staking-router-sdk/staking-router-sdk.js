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
import { ERROR_CODE, invariant } from '@lidofinance/lido-ethereum-sdk';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { Cache } from '../common/decorators/cache.js';
import { ErrorHandler } from '../common/decorators/error-handler.js';
import { Logger } from '../common/decorators/logger.js';
import { ShareLimitStatus } from './types.js';
import { MODULE_ID_BY_CHAIN, PERCENT_BASIS } from '../common/index.js';
let StakingRouterSDK = (() => {
    var _a;
    let _classSuper = CsmSDKModule;
    let _instanceExtraInitializers = [];
    let _getAllModulesDigests_decorators;
    let _getShareLimit_decorators;
    let _getShareLimitStatus_decorators;
    return _a = class StakingRouterSDK extends _classSuper {
            get contract() {
                return this.core.getContractStakingRouter();
            }
            async getAllModulesDigests() {
                return this.contract.read.getAllStakingModuleDigests();
            }
            calculateShareLimit(digests) {
                const moduleId = MODULE_ID_BY_CHAIN[this.core.chainId];
                invariant(moduleId, `CSM moduleId is not specified for ${this.core.chain.name}(${this.core.chain.id})`, ERROR_CODE.NOT_SUPPORTED);
                const moduleDigest = digests.find((digest) => digest.state.id === moduleId);
                invariant(moduleDigest, `CSM module (${moduleId}) is not connected to StakingRouter`, ERROR_CODE.NOT_SUPPORTED);
                const active = moduleDigest.summary.totalDepositedValidators -
                    moduleDigest.summary.totalExitedValidators;
                const queue = moduleDigest.summary.depositableValidatorsCount;
                const totalActive = digests.reduce((acc, { summary }) => acc + summary.totalDepositedValidators - summary.totalExitedValidators, 0n);
                const capacity = (totalActive * BigInt(moduleDigest.state.stakeShareLimit)) /
                    PERCENT_BASIS;
                const activeLeft = capacity - active;
                return {
                    active,
                    activeLeft,
                    capacity,
                    queue,
                };
            }
            async getShareLimit() {
                const digests = await this.getAllModulesDigests();
                return this.calculateShareLimit(digests);
            }
            async getShareLimitStatus(shareLimitThreshold = 200n) {
                const info = await this.getShareLimit();
                return info.activeLeft <= 0
                    ? ShareLimitStatus.REACHED
                    : info.activeLeft - info.queue < 0
                        ? ShareLimitStatus.EXHAUSTED
                        : info.activeLeft - info.queue < shareLimitThreshold
                            ? ShareLimitStatus.APPROACHING
                            : ShareLimitStatus.FAR;
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _getAllModulesDigests_decorators = [Logger('Views:'), ErrorHandler()];
            _getShareLimit_decorators = [Logger('Utils:'), Cache(10 * 60 * 1000)];
            _getShareLimitStatus_decorators = [Logger('Utils:')];
            __esDecorate(_a, null, _getAllModulesDigests_decorators, { kind: "method", name: "getAllModulesDigests", static: false, private: false, access: { has: obj => "getAllModulesDigests" in obj, get: obj => obj.getAllModulesDigests }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getShareLimit_decorators, { kind: "method", name: "getShareLimit", static: false, private: false, access: { has: obj => "getShareLimit" in obj, get: obj => obj.getShareLimit }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getShareLimitStatus_decorators, { kind: "method", name: "getShareLimitStatus", static: false, private: false, access: { has: obj => "getShareLimitStatus" in obj, get: obj => obj.getShareLimitStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { StakingRouterSDK };
//# sourceMappingURL=staking-router-sdk.js.map