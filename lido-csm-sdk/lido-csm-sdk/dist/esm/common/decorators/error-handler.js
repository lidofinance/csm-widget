import { callConsoleMessage } from './utils.js';
import { SDKError } from '@lidofinance/lido-ethereum-sdk';
export const ErrorHandler = function (headMessage = 'Error:') {
    return function ErrorHandlerMethod(originalMethod, context) {
        const methodName = String(context.name);
        const replacementMethod = function (...args) {
            const callback = args[0]?.callback;
            try {
                const result = originalMethod.call(this, ...args);
                if (result instanceof Promise) {
                    return result.catch((error) => {
                        callConsoleMessage.call(this, headMessage, `Error in method '${methodName}'.`, 'Error:');
                        const txError = SDKError.from(error);
                        callback?.({ stage: 'error', payload: txError });
                        throw txError;
                    });
                }
                else {
                    return result;
                }
            }
            catch (error) {
                callConsoleMessage.call(this, headMessage, `Error in method '${methodName}'.`, 'Error:');
                const txError = SDKError.from(error);
                callback?.({ stage: 'error', payload: txError });
                throw txError;
            }
        };
        return replacementMethod;
    };
};
//# sourceMappingURL=error-handler.js.map