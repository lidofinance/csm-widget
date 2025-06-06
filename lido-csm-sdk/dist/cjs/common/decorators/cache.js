"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const index_js_1 = require("../utils/index.js");
const utils_js_1 = require("./utils.js");
const serializeArgs = (args) => args
    .map((arg) => JSON.stringify(arg, (_key, value) => {
    return (0, index_js_1.isBigint)(value) ? value.toString() : value;
}))
    .join(':');
const getDecoratorArgsString = function (args) {
    if (!args)
        return '';
    const argsStringArr = args.map((arg) => {
        const field = arg
            .split('.')
            .reduce((a, b) => a[b], this);
        return arg && typeof field === 'function' ? field.call(this) : field;
    });
    return serializeArgs(argsStringArr);
};
const Cache = function (timeMs = 0, cacheArgs) {
    return function CacheMethod(originalMethod, context) {
        const methodName = String(context.name);
        const replacementMethod = function (...args) {
            const cache = this.cache;
            const decoratorArgsKey = getDecoratorArgsString.call(this, cacheArgs);
            const argsKey = serializeArgs(args);
            const cacheKey = `${methodName}:${decoratorArgsKey}:${argsKey}`;
            if (cache.has(cacheKey)) {
                const cachedEntry = cache.get(cacheKey);
                const currentTime = Date.now();
                if (cachedEntry && currentTime - cachedEntry.timestamp <= timeMs) {
                    utils_js_1.callConsoleMessage.call(this, 'Cache:', `Using cache for method '${methodName}'.`);
                    return cachedEntry.data;
                }
                else {
                    utils_js_1.callConsoleMessage.call(this, 'Cache:', `Cache for method '${methodName}' has expired.`);
                    cache.delete(cacheKey);
                }
            }
            utils_js_1.callConsoleMessage.call(this, 'Cache:', `Cache for method '${methodName}' set.`);
            const result = originalMethod.call(this, ...args);
            if (result instanceof Promise) {
                void result.then((resolvedResult) => cache.set(cacheKey, { data: resolvedResult, timestamp: Date.now() }));
            }
            else
                cache.set(cacheKey, { data: result, timestamp: Date.now() });
            return result;
        };
        return replacementMethod;
    };
};
exports.Cache = Cache;
//# sourceMappingURL=cache.js.map