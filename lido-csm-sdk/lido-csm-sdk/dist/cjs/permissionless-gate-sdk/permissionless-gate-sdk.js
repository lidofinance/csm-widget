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
exports.PermissionlessGateSDK = void 0;
const lido_ethereum_sdk_1 = require("@lidofinance/lido-ethereum-sdk");
const viem_1 = require("viem");
const index_js_1 = require("../abi/index.js");
const csm_sdk_module_js_1 = require("../common/class-primitives/csm-sdk-module.js");
const index_js_2 = require("../common/decorators/index.js");
const index_js_3 = require("../common/index.js");
const index_js_4 = require("../common/utils/index.js");
const NODE_OPERATOR_ADDED_EVENT = (0, viem_1.getAbiItem)({
    abi: index_js_1.CSModuleAbi,
    name: 'NodeOperatorAdded',
});
const NODE_OPERATOR_ADDED_SIGNATURE = (0, viem_1.toEventHash)(NODE_OPERATOR_ADDED_EVENT);
let PermissionlessGateSDK = (() => {
    var _a;
    let _classSuper = csm_sdk_module_js_1.CsmSDKModule;
    let _instanceExtraInitializers = [];
    let _addNodeOperatorETH_decorators;
    let _addNodeOperatorStETH_decorators;
    let _addNodeOperatorWstETH_decorators;
    let _parseProps_decorators;
    let _getPermit_decorators;
    let _receiptParseEvents_decorators;
    let _getCurveId_decorators;
    return _a = class PermissionlessGateSDK extends _classSuper {
            get contract() {
                return this.core.getContractPermissionlessGate();
            }
            async addNodeOperatorETH(props) {
                const { amount: value, keysCount, publicKeys, signatures, managementProperties, referrer, permit, ...rest } = await this.parseProps(props);
                const args = [
                    keysCount,
                    publicKeys,
                    signatures,
                    managementProperties,
                    referrer,
                ];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.addNodeOperatorETH(args, {
                        value,
                        ...options,
                    }),
                    sendTransaction: (options) => this.contract.write.addNodeOperatorETH(args, {
                        value,
                        ...options,
                    }),
                    decodeResult: (receipt) => this.receiptParseEvents(receipt),
                });
            }
            async addNodeOperatorStETH(props) {
                const { amount, keysCount, publicKeys, signatures, managementProperties, referrer, permit: _permit, ...rest } = await this.parseProps(props);
                const permit = await this.getPermit({ token: index_js_3.TOKENS.steth, amount }, _permit);
                const args = [
                    keysCount,
                    publicKeys,
                    signatures,
                    managementProperties,
                    permit,
                    referrer,
                ];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.addNodeOperatorStETH(args, options),
                    sendTransaction: (options) => this.contract.write.addNodeOperatorStETH(args, options),
                    decodeResult: (receipt) => this.receiptParseEvents(receipt),
                });
            }
            async addNodeOperatorWstETH(props) {
                const { amount, keysCount, publicKeys, signatures, managementProperties, referrer, permit: _permit, ...rest } = await this.parseProps(props);
                const permit = await this.getPermit({ token: index_js_3.TOKENS.wsteth, amount }, _permit);
                const args = [
                    keysCount,
                    publicKeys,
                    signatures,
                    managementProperties,
                    permit,
                    referrer,
                ];
                return this.core.performTransaction({
                    ...rest,
                    getGasLimit: (options) => this.contract.estimateGas.addNodeOperatorWstETH(args, options),
                    sendTransaction: (options) => this.contract.write.addNodeOperatorWstETH(args, options),
                    decodeResult: (receipt) => this.receiptParseEvents(receipt),
                });
            }
            async addNodeOperator(props) {
                const { token } = props;
                switch (token) {
                    case index_js_3.TOKENS.eth:
                        return this.addNodeOperatorETH(props);
                    case index_js_3.TOKENS.steth:
                        return this.addNodeOperatorStETH(props);
                    case index_js_3.TOKENS.wsteth:
                        return this.addNodeOperatorWstETH(props);
                    default:
                        throw new lido_ethereum_sdk_1.SDKError({
                            message: 'unsupported token',
                            code: lido_ethereum_sdk_1.ERROR_CODE.INVALID_ARGUMENT,
                        });
                }
            }
            async parseProps(props) {
                const { keysCount, publicKeys, signatures } = (0, index_js_4.parseDepositData)(props.depositData);
                return {
                    ...props,
                    keysCount,
                    publicKeys,
                    signatures,
                    managementProperties: {
                        rewardAddress: props.rewardsAddress && (0, viem_1.isAddress)(props.rewardsAddress)
                            ? props.rewardsAddress
                            : viem_1.zeroAddress,
                        managerAddress: props.managerAddress && (0, viem_1.isAddress)(props.managerAddress)
                            ? props.managerAddress
                            : viem_1.zeroAddress,
                        extendedManagerPermissions: props.extendedManagerPermissions ?? false,
                    },
                    referrer: props.referrer && (0, viem_1.isAddress)(props.referrer)
                        ? props.referrer
                        : viem_1.zeroAddress,
                };
            }
            async getPermit(props, preparedPermit) {
                if (preparedPermit)
                    return preparedPermit;
                const result = await this.bus?.get('spending')?.signPermitOrApprove(props);
                return result?.permit ?? index_js_3.EMPTY_PERMIT;
            }
            async receiptParseEvents(receipt) {
                for (const log of receipt.logs) {
                    if (log.topics[0] !== NODE_OPERATOR_ADDED_SIGNATURE)
                        continue;
                    const parsedLog = (0, viem_1.decodeEventLog)({
                        abi: [NODE_OPERATOR_ADDED_EVENT],
                        strict: true,
                        ...log,
                    });
                    return {
                        nodeOperatorId: parsedLog.args.nodeOperatorId,
                        managerAddress: parsedLog.args.managerAddress,
                        rewardsAddress: parsedLog.args.rewardAddress,
                    };
                }
                throw new lido_ethereum_sdk_1.SDKError({
                    message: 'could not find NodeOperatorAdded event in transaction',
                    code: lido_ethereum_sdk_1.ERROR_CODE.TRANSACTION_ERROR,
                });
            }
            async getCurveId() {
                return this.contract.read.CURVE_ID();
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _addNodeOperatorETH_decorators = [(0, index_js_2.Logger)('Call:'), (0, index_js_2.ErrorHandler)()];
            _addNodeOperatorStETH_decorators = [(0, index_js_2.Logger)('Call:'), (0, index_js_2.ErrorHandler)()];
            _addNodeOperatorWstETH_decorators = [(0, index_js_2.Logger)('Call:'), (0, index_js_2.ErrorHandler)()];
            _parseProps_decorators = [(0, index_js_2.Logger)('Utils:')];
            _getPermit_decorators = [(0, index_js_2.Logger)('Utils:')];
            _receiptParseEvents_decorators = [(0, index_js_2.Logger)('Utils:')];
            _getCurveId_decorators = [(0, index_js_2.Logger)('Views:'), (0, index_js_2.ErrorHandler)()];
            __esDecorate(_a, null, _addNodeOperatorETH_decorators, { kind: "method", name: "addNodeOperatorETH", static: false, private: false, access: { has: obj => "addNodeOperatorETH" in obj, get: obj => obj.addNodeOperatorETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addNodeOperatorStETH_decorators, { kind: "method", name: "addNodeOperatorStETH", static: false, private: false, access: { has: obj => "addNodeOperatorStETH" in obj, get: obj => obj.addNodeOperatorStETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addNodeOperatorWstETH_decorators, { kind: "method", name: "addNodeOperatorWstETH", static: false, private: false, access: { has: obj => "addNodeOperatorWstETH" in obj, get: obj => obj.addNodeOperatorWstETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _parseProps_decorators, { kind: "method", name: "parseProps", static: false, private: false, access: { has: obj => "parseProps" in obj, get: obj => obj.parseProps }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getPermit_decorators, { kind: "method", name: "getPermit", static: false, private: false, access: { has: obj => "getPermit" in obj, get: obj => obj.getPermit }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _receiptParseEvents_decorators, { kind: "method", name: "receiptParseEvents", static: false, private: false, access: { has: obj => "receiptParseEvents" in obj, get: obj => obj.receiptParseEvents }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getCurveId_decorators, { kind: "method", name: "getCurveId", static: false, private: false, access: { has: obj => "getCurveId" in obj, get: obj => obj.getCurveId }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PermissionlessGateSDK = PermissionlessGateSDK;
//# sourceMappingURL=permissionless-gate-sdk.js.map