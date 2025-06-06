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
import { zeroAddress } from 'viem';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { ErrorHandler, Logger } from '../common/decorators/index.js';
import { EMPTY_PERMIT, TOKENS, } from '../common/index.js';
import { parseDepositData } from '../common/utils/parse-deposit-data.js';
import { stripPermit } from '../common/utils/strip-permit.js';
let KeysSDK = (() => {
    var _a;
    let _classSuper = CsmSDKModule;
    let _instanceExtraInitializers = [];
    let _addKeysETH_decorators;
    let _addKeysStETH_decorators;
    let _addKeysWstETH_decorators;
    let _parseProps_decorators;
    let _getPermit_decorators;
    let _removeKeys_decorators;
    let _ejectKeys_decorators;
    let _migrateToPriorityQueue_decorators;
    return _a = class KeysSDK extends _classSuper {
            get contract() {
                return this.core.getContractCSModule();
            }
            get ejectorContract() {
                return this.core.getContractCSEjector();
            }
            async addKeysETH(props) {
                const { nodeOperatorId, amount: value, keysCount, publicKeys, signatures, permit, ...rest } = await this.parseProps(props);
                const args = [
                    rest.account.address,
                    nodeOperatorId,
                    keysCount,
                    publicKeys,
                    signatures,
                ];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.addValidatorKeysETH(args, {
                        value,
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.addValidatorKeysETH(args, {
                        value,
                        ...options,
                    }),
                });
            }
            async addKeysStETH(props) {
                const { nodeOperatorId, amount, keysCount, publicKeys, signatures, permit: _permit, ...rest } = await this.parseProps(props);
                const { hash, permit } = await this.getPermit({ token: TOKENS.steth, amount, ...rest }, _permit);
                if (hash)
                    return { hash };
                const args = [
                    rest.account.address,
                    nodeOperatorId,
                    keysCount,
                    publicKeys,
                    signatures,
                    permit,
                ];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.addValidatorKeysStETH(args, options),
                    sendTransaction: (options) => this.contract.write.addValidatorKeysStETH(args, options),
                });
            }
            async addKeysWstETH(props) {
                const { nodeOperatorId, amount, keysCount, publicKeys, signatures, permit: _permit, ...rest } = await this.parseProps(props);
                const { hash, permit } = await this.getPermit({ token: TOKENS.wsteth, amount, ...rest }, _permit);
                if (hash)
                    return { hash };
                const args = [
                    rest.account.address,
                    nodeOperatorId,
                    keysCount,
                    publicKeys,
                    signatures,
                    permit,
                ];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.addValidatorKeysWstETH(args, options),
                    sendTransaction: (options) => this.contract.write.addValidatorKeysWstETH(args, options),
                });
            }
            async addKeys(props) {
                const { token } = props;
                if (props.amount === 0n) {
                    return this.addKeysStETH(props);
                }
                switch (token) {
                    case TOKENS.eth:
                        return this.addKeysETH(props);
                    case TOKENS.steth:
                        return this.addKeysStETH(props);
                    case TOKENS.wsteth:
                        return this.addKeysWstETH(props);
                    default:
                        throw new SDKError({
                            message: 'unsupported token',
                            code: ERROR_CODE.INVALID_ARGUMENT,
                        });
                }
            }
            async parseProps(props) {
                const { keysCount, publicKeys, signatures } = parseDepositData(props.depositData);
                const account = await this.core.core.useAccount(props.account);
                return {
                    ...props,
                    keysCount,
                    publicKeys,
                    signatures,
                    account,
                };
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
            async removeKeys(props) {
                const { nodeOperatorId, startIndex, keysCount, ...rest } = props;
                const args = [nodeOperatorId, startIndex, keysCount];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.removeKeys(args, {
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.removeKeys(args, {
                        ...options,
                    }),
                });
            }
            async ejectKeys(props) {
                const { nodeOperatorId, keyIndices, amount: value, refundRecipient = zeroAddress, ...rest } = props;
                const args = [nodeOperatorId, keyIndices, refundRecipient];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.ejectorContract.estimateGas.voluntaryEjectByArray(args, {
                        value,
                        ...options,
                    }),
                    sendTransaction: (options) => this.ejectorContract.write.voluntaryEjectByArray(args, {
                        value,
                        ...options,
                    }),
                });
            }
            async migrateToPriorityQueue(props) {
                const { nodeOperatorId, ...rest } = props;
                const args = [nodeOperatorId];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.migrateToPriorityQueue(args, {
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.migrateToPriorityQueue(args, {
                        ...options,
                    }),
                });
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _addKeysETH_decorators = [Logger('Call:'), ErrorHandler()];
            _addKeysStETH_decorators = [Logger('Call:'), ErrorHandler()];
            _addKeysWstETH_decorators = [Logger('Call:'), ErrorHandler()];
            _parseProps_decorators = [Logger('Utils:')];
            _getPermit_decorators = [Logger('Utils:')];
            _removeKeys_decorators = [Logger('Call:'), ErrorHandler()];
            _ejectKeys_decorators = [Logger('Call:'), ErrorHandler()];
            _migrateToPriorityQueue_decorators = [Logger('Call:'), ErrorHandler()];
            __esDecorate(_a, null, _addKeysETH_decorators, { kind: "method", name: "addKeysETH", static: false, private: false, access: { has: obj => "addKeysETH" in obj, get: obj => obj.addKeysETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addKeysStETH_decorators, { kind: "method", name: "addKeysStETH", static: false, private: false, access: { has: obj => "addKeysStETH" in obj, get: obj => obj.addKeysStETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addKeysWstETH_decorators, { kind: "method", name: "addKeysWstETH", static: false, private: false, access: { has: obj => "addKeysWstETH" in obj, get: obj => obj.addKeysWstETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _parseProps_decorators, { kind: "method", name: "parseProps", static: false, private: false, access: { has: obj => "parseProps" in obj, get: obj => obj.parseProps }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getPermit_decorators, { kind: "method", name: "getPermit", static: false, private: false, access: { has: obj => "getPermit" in obj, get: obj => obj.getPermit }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _removeKeys_decorators, { kind: "method", name: "removeKeys", static: false, private: false, access: { has: obj => "removeKeys" in obj, get: obj => obj.removeKeys }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _ejectKeys_decorators, { kind: "method", name: "ejectKeys", static: false, private: false, access: { has: obj => "ejectKeys" in obj, get: obj => obj.ejectKeys }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _migrateToPriorityQueue_decorators, { kind: "method", name: "migrateToPriorityQueue", static: false, private: false, access: { has: obj => "migrateToPriorityQueue" in obj, get: obj => obj.migrateToPriorityQueue }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { KeysSDK };
//# sourceMappingURL=keys-sdk.js.map