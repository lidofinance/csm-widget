import { callConsoleMessage } from './utils.js';
export const Logger = function (headMessage = 'LOG:') {
    return function LoggerMethod(originalMethod, context) {
        const methodName = String(context.name);
        const replacementMethod = function (...args) {
            if (headMessage === 'Deprecation:')
                callConsoleMessage.call(this, headMessage, `Method '${methodName}' is being deprecated in the next major version`);
            callConsoleMessage.call(this, headMessage, `Entering method '${methodName}'.`);
            const result = originalMethod.call(this, ...args);
            if (result instanceof Promise) {
                return result
                    .then((resolvedResult) => {
                    callConsoleMessage.call(this, headMessage, `Exiting method '${methodName}'.`);
                    return resolvedResult;
                })
                    .catch((error) => {
                    callConsoleMessage.call(this, headMessage, `Exiting method '${methodName}' with error.`, 'Error:');
                    throw error;
                });
            }
            else {
                callConsoleMessage.call(this, headMessage, `Exiting method '${methodName}'.`);
                return result;
            }
        };
        return replacementMethod;
    };
};
//# sourceMappingURL=logger.js.map