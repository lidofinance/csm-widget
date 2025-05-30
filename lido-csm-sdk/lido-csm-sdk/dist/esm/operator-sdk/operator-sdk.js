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
import { ErrorHandler } from '../common/decorators/error-handler.js';
import { Logger } from '../common/decorators/logger.js';
import { clearEmptyAddress } from '../common/utils/clear-empty-address.js';
import { splitKeys } from '../common/utils/slitp-keys.js';
import { calcBondBalance } from './calc-bond-balance.js';
let OperatorSDK = (() => {
    var _a;
    let _classSuper = CsmSDKModule;
    let _instanceExtraInitializers = [];
    let _getCurveId_decorators;
    let _getBondBalance_decorators;
    let _getInfo_decorators;
    let _getKeys_decorators;
    let _getKeysCountToMigrate_decorators;
    return _a = class OperatorSDK extends _classSuper {
            get accountingContract() {
                return this.core.getContractCSAccounting();
            }
            get moduleContract() {
                return this.core.getContractCSModule();
            }
            async getCurveId(id) {
                return this.accountingContract.read.getBondCurveId([id]);
            }
            async getBondBalance(id) {
                const [[current, required], locked] = await Promise.all([
                    this.accountingContract.read.getBondSummary([id]),
                    this.accountingContract.read.getActualLockedBond([id]),
                ]);
                return calcBondBalance({ current, required, locked });
            }
            async getInfo(id) {
                const info = await this.moduleContract.read.getNodeOperator([id]);
                return {
                    ...info,
                    rewardsAddress: info.rewardAddress,
                    proposedManagerAddress: clearEmptyAddress(info.proposedManagerAddress),
                    proposedRewardsAddress: clearEmptyAddress(info.proposedRewardAddress),
                };
            }
            async getKeys(id, start = 0n) {
                const info = await this.getInfo(id);
                const count = BigInt(info.totalAddedKeys) - start;
                const keysString = await this.moduleContract.read.getSigningKeys([
                    id,
                    start,
                    count,
                ]);
                return splitKeys(keysString);
            }
            async getKeysCountToMigrate(id) {
                const [info, curveId] = await Promise.all([
                    this.getInfo(id),
                    this.getCurveId(id),
                ]);
                if (info.usedPriorityQueue)
                    return 0;
                const [{ priority, maxDeposits }, legacyQueue] = await Promise.all([
                    this.bus.getOrThrow('parameters').getQueueConfig(curveId),
                    this.moduleContract.read.QUEUE_LEGACY_PRIORITY(),
                ]);
                if (BigInt(priority) >= legacyQueue)
                    return 0;
                const deposited = info.totalDepositedKeys;
                if (maxDeposits <= deposited)
                    return 0;
                return Math.min(maxDeposits - deposited, info.enqueuedCount);
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _getCurveId_decorators = [Logger('Views:'), ErrorHandler()];
            _getBondBalance_decorators = [Logger('Views:'), ErrorHandler()];
            _getInfo_decorators = [Logger('Views:'), ErrorHandler()];
            _getKeys_decorators = [Logger('Views:'), ErrorHandler()];
            _getKeysCountToMigrate_decorators = [Logger('Views:'), ErrorHandler()];
            __esDecorate(_a, null, _getCurveId_decorators, { kind: "method", name: "getCurveId", static: false, private: false, access: { has: obj => "getCurveId" in obj, get: obj => obj.getCurveId }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getBondBalance_decorators, { kind: "method", name: "getBondBalance", static: false, private: false, access: { has: obj => "getBondBalance" in obj, get: obj => obj.getBondBalance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getInfo_decorators, { kind: "method", name: "getInfo", static: false, private: false, access: { has: obj => "getInfo" in obj, get: obj => obj.getInfo }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getKeys_decorators, { kind: "method", name: "getKeys", static: false, private: false, access: { has: obj => "getKeys" in obj, get: obj => obj.getKeys }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getKeysCountToMigrate_decorators, { kind: "method", name: "getKeysCountToMigrate", static: false, private: false, access: { has: obj => "getKeysCountToMigrate" in obj, get: obj => obj.getKeysCountToMigrate }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { OperatorSDK };
//# sourceMappingURL=operator-sdk.js.map