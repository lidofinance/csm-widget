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
exports.SpendingSDK = void 0;
const lido_ethereum_sdk_1 = require("@lidofinance/lido-ethereum-sdk");
const viem_1 = require("viem");
const csm_sdk_module_js_1 = require("../common/class-primitives/csm-sdk-module.js");
const error_handler_js_1 = require("../common/decorators/error-handler.js");
const logger_js_1 = require("../common/decorators/logger.js");
const index_js_1 = require("../common/index.js");
const types_js_1 = require("../core-sdk/types.js");
let SpendingSDK = (() => {
    var _a;
    let _classSuper = csm_sdk_module_js_1.CsmSDKModule;
    let _instanceExtraInitializers = [];
    let _signPermit_decorators;
    let _allowance_decorators;
    let _checkAllowance_decorators;
    let _approve_decorators;
    let _isMultisig_decorators;
    let _signPermitOrApprove_decorators;
    return _a = class SpendingSDK extends _classSuper {
            get spender() {
                return this.core.getContractAddress(index_js_1.CSM_CONTRACT_NAMES.csAccounting);
            }
            getTokenContract(token) {
                return (0, viem_1.getContract)({
                    address: this.core.getContractAddress(token),
                    abi: viem_1.erc20Abi,
                    client: {
                        public: this.core.core.rpcProvider,
                        wallet: this.core.core.web3Provider,
                    },
                });
            }
            async signPermit(props) {
                const { token, amount, callback = lido_ethereum_sdk_1.NOOP } = this.parseProps(props);
                await callback({
                    stage: types_js_1.TransactionCallbackStage.PERMIT_SIGN,
                    payload: { token, amount },
                });
                return this.core.core.signPermit({
                    ...props,
                    amount,
                    spender: this.spender,
                });
            }
            async allowance({ account: accountProp, token, }) {
                const account = await this.core.core.useAccount(accountProp);
                const contract = this.getTokenContract(token);
                return contract.read.allowance([account.address, this.spender]);
            }
            async checkAllowance(props) {
                const { amount, ...rest } = this.parseProps(props);
                const allowance = await this.allowance(rest);
                const needsApprove = allowance < amount;
                return {
                    allowance,
                    needsApprove,
                };
            }
            async approve(props) {
                const { amount, token, ...rest } = this.parseProps(props);
                const contract = this.getTokenContract(token);
                const txArguments = [this.spender, amount];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => contract.estimateGas.approve(txArguments, options),
                    sendTransaction: (options) => contract.write.approve(txArguments, options),
                });
            }
            async isMultisig(props) {
                const account = await this.core.core.useAccount(props.account);
                return this.core.core.isContract(account.address);
            }
            async signPermitOrApprove(props) {
                const { needsApprove } = await this.checkAllowance(props);
                if (!needsApprove) {
                    return { permit: index_js_1.EMPTY_PERMIT };
                }
                const account = await this.core.core.useAccount(props.account);
                const isMultisig = await this.core.core.isContract(account.address);
                if (isMultisig) {
                    const { hash } = await this.approve({
                        ...props,
                        callback: this.wrapApproveCallback(props),
                    });
                    return { permit: index_js_1.EMPTY_PERMIT, hash };
                }
                else {
                    const permit = await this.signPermit(props);
                    return { permit };
                }
            }
            wrapApproveCallback({ callback, ...props }) {
                if (!callback)
                    return undefined;
                const { token, amount } = this.parseProps(props);
                return (args) => {
                    switch (args.stage) {
                        case types_js_1.TransactionCallbackStage.SIGN:
                            return callback({
                                stage: types_js_1.TransactionCallbackStage.APPROVE_SIGN,
                                payload: { token, amount },
                            });
                        case types_js_1.TransactionCallbackStage.RECEIPT:
                            return callback({
                                stage: types_js_1.TransactionCallbackStage.APPROVE_RECEIPT,
                                payload: { token, amount, hash: args.payload.hash },
                            });
                        case types_js_1.TransactionCallbackStage.MULTISIG_DONE:
                            return callback(args);
                        default:
                    }
                };
            }
            parseProps(props) {
                let { amount } = props;
                if (props.token === index_js_1.TOKENS.steth && amount > 0) {
                    amount += index_js_1.STETH_ROUNDING_THRESHOLD;
                }
                return { ...props, amount };
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _signPermit_decorators = [(0, logger_js_1.Logger)('Permit:'), (0, error_handler_js_1.ErrorHandler)()];
            _allowance_decorators = [(0, logger_js_1.Logger)('Views:')];
            _checkAllowance_decorators = [(0, logger_js_1.Logger)('Utils:'), (0, error_handler_js_1.ErrorHandler)()];
            _approve_decorators = [(0, logger_js_1.Logger)('Call:'), (0, error_handler_js_1.ErrorHandler)()];
            _isMultisig_decorators = [(0, logger_js_1.Logger)('Views:')];
            _signPermitOrApprove_decorators = [(0, logger_js_1.Logger)('Utils:')];
            __esDecorate(_a, null, _signPermit_decorators, { kind: "method", name: "signPermit", static: false, private: false, access: { has: obj => "signPermit" in obj, get: obj => obj.signPermit }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _allowance_decorators, { kind: "method", name: "allowance", static: false, private: false, access: { has: obj => "allowance" in obj, get: obj => obj.allowance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _checkAllowance_decorators, { kind: "method", name: "checkAllowance", static: false, private: false, access: { has: obj => "checkAllowance" in obj, get: obj => obj.checkAllowance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _approve_decorators, { kind: "method", name: "approve", static: false, private: false, access: { has: obj => "approve" in obj, get: obj => obj.approve }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _isMultisig_decorators, { kind: "method", name: "isMultisig", static: false, private: false, access: { has: obj => "isMultisig" in obj, get: obj => obj.isMultisig }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _signPermitOrApprove_decorators, { kind: "method", name: "signPermitOrApprove", static: false, private: false, access: { has: obj => "signPermitOrApprove" in obj, get: obj => obj.signPermitOrApprove }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SpendingSDK = SpendingSDK;
//# sourceMappingURL=spending-sdk.js.map