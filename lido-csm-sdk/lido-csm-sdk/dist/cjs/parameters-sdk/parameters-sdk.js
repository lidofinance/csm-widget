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
exports.ParametersSDK = void 0;
const csm_sdk_module_js_1 = require("../common/class-primitives/csm-sdk-module.js");
const error_handler_js_1 = require("../common/decorators/error-handler.js");
const logger_js_1 = require("../common/decorators/logger.js");
let ParametersSDK = (() => {
    var _a;
    let _classSuper = csm_sdk_module_js_1.CsmSDKModule;
    let _instanceExtraInitializers = [];
    let _getKeysRemovalFee_decorators;
    let _getQueueConfig_decorators;
    return _a = class ParametersSDK extends _classSuper {
            get contract() {
                return this.core.getContractCSParametersRegistry();
            }
            async getKeysRemovalFee(curveId) {
                return this.contract.read.getKeyRemovalCharge([curveId]);
            }
            async getQueueConfig(curveId) {
                const [priority, maxDeposits] = await this.contract.read.getQueueConfig([
                    curveId,
                ]);
                return { priority, maxDeposits };
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _getKeysRemovalFee_decorators = [(0, logger_js_1.Logger)('Views:'), (0, error_handler_js_1.ErrorHandler)()];
            _getQueueConfig_decorators = [(0, logger_js_1.Logger)('Views:'), (0, error_handler_js_1.ErrorHandler)()];
            __esDecorate(_a, null, _getKeysRemovalFee_decorators, { kind: "method", name: "getKeysRemovalFee", static: false, private: false, access: { has: obj => "getKeysRemovalFee" in obj, get: obj => obj.getKeysRemovalFee }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getQueueConfig_decorators, { kind: "method", name: "getQueueConfig", static: false, private: false, access: { has: obj => "getQueueConfig" in obj, get: obj => obj.getQueueConfig }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ParametersSDK = ParametersSDK;
//# sourceMappingURL=parameters-sdk.js.map