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
exports.AccountingSDK = void 0;
const csm_sdk_module_js_1 = require("../common/class-primitives/csm-sdk-module.js");
const error_handler_js_1 = require("../common/decorators/error-handler.js");
const logger_js_1 = require("../common/decorators/logger.js");
const index_js_1 = require("../common/index.js");
let AccountingSDK = (() => {
    var _a;
    let _classSuper = csm_sdk_module_js_1.CsmSDKModule;
    let _instanceExtraInitializers = [];
    let _getBondAmountByKeysCountETH_decorators;
    let _getBondAmountByKeysCountWstETH_decorators;
    let _getCurve_decorators;
    let _getKeysCountByBondAmount_decorators;
    let _getBondForNextKeysETH_decorators;
    let _getBondForNextKeysWstETH_decorators;
    let _getBondForNextKeysPerToken_decorators;
    let _getKeysRemovalFee_decorators;
    return _a = class AccountingSDK extends _classSuper {
            get contract() {
                return this.core.getContractCSAccounting();
            }
            get parametersContract() {
                return this.core.getContractCSParametersRegistry();
            }
            async getBondAmountByKeysCountETH({ curveId, keysCount, }) {
                return this.contract.read.getBondAmountByKeysCount([keysCount, curveId]);
            }
            async getBondAmountByKeysCountWstETH({ curveId, keysCount, }) {
                return this.contract.read.getBondAmountByKeysCountWstETH([
                    keysCount,
                    curveId,
                ]);
            }
            async getBondAmountByKeysCountPerToken(props) {
                const [eth, wsteth] = await Promise.all([
                    this.getBondAmountByKeysCountETH(props),
                    this.getBondAmountByKeysCountWstETH(props),
                ]);
                return {
                    [index_js_1.TOKENS.eth]: eth,
                    [index_js_1.TOKENS.steth]: eth,
                    [index_js_1.TOKENS.wsteth]: wsteth,
                };
            }
            async getCurve(curveId) {
                return this.contract.read.getCurveInfo([curveId]);
            }
            async getKeysCountByBondAmount({ amount, curveId, }) {
                return this.contract.read.getKeysCountByBondAmount([amount, curveId]);
            }
            async getBondForNextKeysETH({ nodeOperatorId, keysCount, }) {
                return this.contract.read.getRequiredBondForNextKeys([
                    nodeOperatorId,
                    keysCount,
                ]);
            }
            async getBondForNextKeysWstETH({ nodeOperatorId, keysCount, }) {
                return this.contract.read.getRequiredBondForNextKeysWstETH([
                    nodeOperatorId,
                    keysCount,
                ]);
            }
            async getBondForNextKeysPerToken(props) {
                const [eth, wsteth] = await Promise.all([
                    this.getBondForNextKeysETH(props),
                    this.getBondForNextKeysWstETH(props),
                ]);
                return {
                    [index_js_1.TOKENS.eth]: eth,
                    [index_js_1.TOKENS.steth]: eth,
                    [index_js_1.TOKENS.wsteth]: wsteth,
                };
            }
            async getKeysRemovalFee(curveId) {
                return this.parametersContract.read.getKeyRemovalCharge([curveId]);
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _getBondAmountByKeysCountETH_decorators = [(0, logger_js_1.Logger)('Views:'), (0, error_handler_js_1.ErrorHandler)()];
            _getBondAmountByKeysCountWstETH_decorators = [(0, logger_js_1.Logger)('Views:'), (0, error_handler_js_1.ErrorHandler)()];
            _getCurve_decorators = [(0, logger_js_1.Logger)('Views:'), (0, error_handler_js_1.ErrorHandler)()];
            _getKeysCountByBondAmount_decorators = [(0, logger_js_1.Logger)('Views:'), (0, error_handler_js_1.ErrorHandler)()];
            _getBondForNextKeysETH_decorators = [(0, logger_js_1.Logger)('Views:'), (0, error_handler_js_1.ErrorHandler)()];
            _getBondForNextKeysWstETH_decorators = [(0, logger_js_1.Logger)('Views:'), (0, error_handler_js_1.ErrorHandler)()];
            _getBondForNextKeysPerToken_decorators = [(0, logger_js_1.Logger)('Utils:'), (0, error_handler_js_1.ErrorHandler)()];
            _getKeysRemovalFee_decorators = [(0, logger_js_1.Logger)('Views:'), (0, error_handler_js_1.ErrorHandler)()];
            __esDecorate(_a, null, _getBondAmountByKeysCountETH_decorators, { kind: "method", name: "getBondAmountByKeysCountETH", static: false, private: false, access: { has: obj => "getBondAmountByKeysCountETH" in obj, get: obj => obj.getBondAmountByKeysCountETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getBondAmountByKeysCountWstETH_decorators, { kind: "method", name: "getBondAmountByKeysCountWstETH", static: false, private: false, access: { has: obj => "getBondAmountByKeysCountWstETH" in obj, get: obj => obj.getBondAmountByKeysCountWstETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getCurve_decorators, { kind: "method", name: "getCurve", static: false, private: false, access: { has: obj => "getCurve" in obj, get: obj => obj.getCurve }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getKeysCountByBondAmount_decorators, { kind: "method", name: "getKeysCountByBondAmount", static: false, private: false, access: { has: obj => "getKeysCountByBondAmount" in obj, get: obj => obj.getKeysCountByBondAmount }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getBondForNextKeysETH_decorators, { kind: "method", name: "getBondForNextKeysETH", static: false, private: false, access: { has: obj => "getBondForNextKeysETH" in obj, get: obj => obj.getBondForNextKeysETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getBondForNextKeysWstETH_decorators, { kind: "method", name: "getBondForNextKeysWstETH", static: false, private: false, access: { has: obj => "getBondForNextKeysWstETH" in obj, get: obj => obj.getBondForNextKeysWstETH }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getBondForNextKeysPerToken_decorators, { kind: "method", name: "getBondForNextKeysPerToken", static: false, private: false, access: { has: obj => "getBondForNextKeysPerToken" in obj, get: obj => obj.getBondForNextKeysPerToken }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getKeysRemovalFee_decorators, { kind: "method", name: "getKeysRemovalFee", static: false, private: false, access: { has: obj => "getKeysRemovalFee" in obj, get: obj => obj.getKeysRemovalFee }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AccountingSDK = AccountingSDK;
//# sourceMappingURL=accounting-sdk.js.map