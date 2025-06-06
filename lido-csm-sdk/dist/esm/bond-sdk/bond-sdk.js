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
import { ERROR_CODE, SDKError, } from '@lidofinance/lido-ethereum-sdk';
import { decodeEventLog, getAbiItem, toEventHash, } from 'viem';
import { CSAccountingAbi } from '../abi/CSAccounting.js';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { ErrorHandler, Logger } from '../common/decorators/index.js';
import { EMPTY_PERMIT, TOKENS, } from '../common/index.js';
import { stripPermit } from '../common/utils/strip-permit.js';
const BOND_LOCK_CHANGED_EVENT = getAbiItem({
    abi: CSAccountingAbi,
    name: 'BondLockChanged',
});
const BOND_LOCK_CHANGED_SIGNATURE = toEventHash(BOND_LOCK_CHANGED_EVENT);
let BondSDK = (() => {
    var _a;
    let _classSuper = CsmSDKModule;
    let _instanceExtraInitializers = [];
    let _getBondSummary_decorators;
    let _addBondETH_decorators;
    let _addBondStETH_decorators;
    let _addBondWstETH_decorators;
    let _getPermit_decorators;
    let _coverLockedBond_decorators;
    let _coverReceiptParseEvents_decorators;
    let _pullRewards_decorators;
    let _claimBondUnstETH_decorators;
    let _claimBondStETH_decorators;
    let _claimBondWstETH_decorators;
    return _a = class BondSDK extends _classSuper {
            get contract() {
                return this.core.getContractCSAccounting();
            }
            async getBondSummary(id) {
                const [current, required] = await this.contract.read.getBondSummary([id]);
                return { current, required };
            }
            async addBondETH(props) {
                const { nodeOperatorId, amount: value, permit, ...rest } = props;
                const args = [nodeOperatorId];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.depositETH(args, {
                        value,
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.depositETH(args, {
                        value,
                        ...options,
                    }),
                    decodeResult: () => this.getBondSummary(nodeOperatorId),
                });
            }
            async addBondStETH(props) {
                const { nodeOperatorId, amount, permit: _permit, ...rest } = props;
                const { hash, permit } = await this.getPermit({ token: TOKENS.steth, amount, ...rest }, _permit);
                if (hash)
                    return { hash };
                const args = [nodeOperatorId, amount, permit];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.depositStETH(args, options),
                    sendTransaction: (options) => this.contract.write.depositStETH(args, options),
                    decodeResult: () => this.getBondSummary(nodeOperatorId),
                });
            }
            async addBondWstETH(props) {
                const { nodeOperatorId, amount, permit: _permit, ...rest } = props;
                const { hash, permit } = await this.getPermit({ token: TOKENS.wsteth, amount, ...rest }, _permit);
                if (hash)
                    return { hash };
                const args = [nodeOperatorId, amount, permit];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.depositWstETH(args, options),
                    sendTransaction: (options) => this.contract.write.depositWstETH(args, options),
                    decodeResult: () => this.getBondSummary(nodeOperatorId),
                });
            }
            async addBond(props) {
                const { token } = props;
                switch (token) {
                    case TOKENS.eth:
                        return this.addBondETH(props);
                    case TOKENS.steth:
                        return this.addBondStETH(props);
                    case TOKENS.wsteth:
                        return this.addBondWstETH(props);
                    default:
                        throw new SDKError({
                            message: 'unsupported token',
                            code: ERROR_CODE.INVALID_ARGUMENT,
                        });
                }
            }
            async getPermit(props, preparedPermit) {
                if (preparedPermit)
                    return { permit: stripPermit(preparedPermit) };
                const result = await this.bus?.get('spending')?.signPermitOrApprove(props);
                return {
                    hash: result?.hash,
                    permit: stripPermit(result?.permit ?? EMPTY_PERMIT),
                };
            }
            async coverLockedBond(props) {
                const { nodeOperatorId, amount: value, ...rest } = props;
                const args = [nodeOperatorId];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.compensateLockedBondETH(args, {
                        value,
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.compensateLockedBondETH(args, {
                        value,
                        ...options,
                    }),
                    decodeResult: (receipt) => this.coverReceiptParseEvents(receipt),
                });
            }
            async coverReceiptParseEvents(receipt) {
                for (const log of receipt.logs) {
                    // skips non-relevant events
                    if (log.topics[0] !== BOND_LOCK_CHANGED_SIGNATURE)
                        continue;
                    const parsedLog = decodeEventLog({
                        abi: [BOND_LOCK_CHANGED_EVENT],
                        strict: true,
                        ...log,
                    });
                    return parsedLog.args.newAmount;
                }
                throw new SDKError({
                    message: 'could not find BondLockChanged event in transaction',
                    code: ERROR_CODE.TRANSACTION_ERROR,
                });
            }
            parseClaimProps(props) {
                return { ...props, proof: props.proof ?? [], shares: props.shares ?? 0n };
            }
            async pullRewards(props) {
                const { nodeOperatorId, shares, proof, ...rest } = this.parseClaimProps(props);
                const args = [nodeOperatorId, shares, proof];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.pullFeeRewards(args, {
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.pullFeeRewards(args, {
                        ...options,
                    }),
                });
            }
            async claimBondUnstETH(props) {
                const { nodeOperatorId, amount, shares, proof, ...rest } = this.parseClaimProps(props);
                const args = [nodeOperatorId, amount, shares, proof];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.claimRewardsUnstETH(args, {
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.claimRewardsUnstETH(args, {
                        ...options,
                    }),
                });
            }
            async claimBondStETH(props) {
                const { nodeOperatorId, amount, shares, proof, ...rest } = this.parseClaimProps(props);
                const args = [nodeOperatorId, amount, shares, proof];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.claimRewardsStETH(args, {
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.claimRewardsStETH(args, {
                        ...options,
                    }),
                });
            }
            async claimBondWstETH(props) {
                const { nodeOperatorId, amount, shares, proof, ...rest } = this.parseClaimProps(props);
                const args = [nodeOperatorId, amount, shares, proof];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.claimRewardsWstETH(args, {
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.claimRewardsWstETH(args, {
                        ...options,
                    }),
                });
            }
            async claimBond(props) {
                const { token } = props;
                if (props.amount === 0n) {
                    return this.pullRewards(props);
                }
                switch (token) {
                    case TOKENS.eth:
                        return this.claimBondUnstETH(props);
                    case TOKENS.steth:
                        return this.claimBondStETH(props);
                    case TOKENS.wsteth:
                        return this.claimBondWstETH(props);
                    default:
                        throw new SDKError({
                            message: 'unsupported token',
                            code: ERROR_CODE.INVALID_ARGUMENT,
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
            _getBondSummary_decorators = [Logger('Views:'), ErrorHandler()];
            _addBondETH_decorators = [Logger('Call:'), ErrorHandler()];
            _addBondStETH_decorators = [Logger('Call:'), ErrorHandler()];
            _addBondWstETH_decorators = [Logger('Call:'), ErrorHandler()];
            _getPermit_decorators = [Logger('Utils:')];
            _coverLockedBond_decorators = [Logger('Call:'), ErrorHandler()];
            _coverReceiptParseEvents_decorators = [Logger('Utils:')];
            _pullRewards_decorators = [Logger('Call:'), ErrorHandler()];
            _claimBondUnstETH_decorators = [Logger('Call:'), ErrorHandler()];
            _claimBondStETH_decorators = [Logger('Call:'), ErrorHandler()];
            _claimBondWstETH_decorators = [Logger('Call:'), ErrorHandler()];
            __esDecorate(_a, null, _getBondSummary_decorators, { kind: "method", name: "getBondSummary", static: false, private: false, access: { has: obj => "getBondSummary" in obj, get: obj => obj.getBondSummary }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addBondETH_decorators, { kind: "method", name: "addBondETH", static: false, private: false, access: { has: obj => "addBondETH" in obj, get: obj => obj.addBondETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addBondStETH_decorators, { kind: "method", name: "addBondStETH", static: false, private: false, access: { has: obj => "addBondStETH" in obj, get: obj => obj.addBondStETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addBondWstETH_decorators, { kind: "method", name: "addBondWstETH", static: false, private: false, access: { has: obj => "addBondWstETH" in obj, get: obj => obj.addBondWstETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getPermit_decorators, { kind: "method", name: "getPermit", static: false, private: false, access: { has: obj => "getPermit" in obj, get: obj => obj.getPermit }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _coverLockedBond_decorators, { kind: "method", name: "coverLockedBond", static: false, private: false, access: { has: obj => "coverLockedBond" in obj, get: obj => obj.coverLockedBond }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _coverReceiptParseEvents_decorators, { kind: "method", name: "coverReceiptParseEvents", static: false, private: false, access: { has: obj => "coverReceiptParseEvents" in obj, get: obj => obj.coverReceiptParseEvents }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _pullRewards_decorators, { kind: "method", name: "pullRewards", static: false, private: false, access: { has: obj => "pullRewards" in obj, get: obj => obj.pullRewards }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _claimBondUnstETH_decorators, { kind: "method", name: "claimBondUnstETH", static: false, private: false, access: { has: obj => "claimBondUnstETH" in obj, get: obj => obj.claimBondUnstETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _claimBondStETH_decorators, { kind: "method", name: "claimBondStETH", static: false, private: false, access: { has: obj => "claimBondStETH" in obj, get: obj => obj.claimBondStETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _claimBondWstETH_decorators, { kind: "method", name: "claimBondWstETH", static: false, private: false, access: { has: obj => "claimBondWstETH" in obj, get: obj => obj.claimBondWstETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { BondSDK };
//# sourceMappingURL=bond-sdk.js.map