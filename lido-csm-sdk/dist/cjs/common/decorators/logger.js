"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const utils_js_1 = require("./utils.js");
const Logger = function (headMessage = 'LOG:') {
    return function LoggerMethod(originalMethod, context) {
        const methodName = String(context.name);
        const replacementMethod = function (...args) {
            if (headMessage === 'Deprecation:')
                utils_js_1.callConsoleMessage.call(this, headMessage, `Method '${methodName}' is being deprecated in the next major version`);
            utils_js_1.callConsoleMessage.call(this, headMessage, `Entering method '${methodName}'.`);
            const result = originalMethod.call(this, ...args);
            if (result instanceof Promise) {
                return result
                    .then((resolvedResult) => {
                    utils_js_1.callConsoleMessage.call(this, headMessage, `Exiting method '${methodName}'.`);
                    return resolvedResult;
                })
                    .catch((error) => {
                    utils_js_1.callConsoleMessage.call(this, headMessage, `Exiting method '${methodName}' with error.`, 'Error:');
                    throw error;
                });
            }
            else {
                utils_js_1.callConsoleMessage.call(this, headMessage, `Exiting method '${methodName}'.`);
                return result;
            }
        };
        return replacementMethod;
    };
};
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map