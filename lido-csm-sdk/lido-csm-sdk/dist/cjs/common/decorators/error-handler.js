"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const utils_js_1 = require("./utils.js");
const lido_ethereum_sdk_1 = require("@lidofinance/lido-ethereum-sdk");
const ErrorHandler = function (headMessage = 'Error:') {
    return function ErrorHandlerMethod(originalMethod, context) {
        const methodName = String(context.name);
        const replacementMethod = function (...args) {
            const callback = args[0]?.callback;
            try {
                const result = originalMethod.call(this, ...args);
                if (result instanceof Promise) {
                    return result.catch((error) => {
                        utils_js_1.callConsoleMessage.call(this, headMessage, `Error in method '${methodName}'.`, 'Error:');
                        const txError = lido_ethereum_sdk_1.SDKError.from(error);
                        callback?.({ stage: 'error', payload: txError });
                        throw txError;
                    });
                }
                else {
                    return result;
                }
            }
            catch (error) {
                utils_js_1.callConsoleMessage.call(this, headMessage, `Error in method '${methodName}'.`, 'Error:');
                const txError = lido_ethereum_sdk_1.SDKError.from(error);
                callback?.({ stage: 'error', payload: txError });
                throw txError;
            }
        };
        return replacementMethod;
    };
};
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=error-handler.js.map