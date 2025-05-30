"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCore = exports.isCore = exports.callConsoleMessage = void 0;
const constants_js_1 = require("./constants.js");
const getLogMode = function () {
    let logMode = 'info';
    if ((0, exports.isCore)(this)) {
        logMode = this.logMode;
    }
    else if ((0, exports.hasCore)(this)) {
        logMode = this.core.logMode;
    }
    return logMode;
};
const callConsoleMessage = function (headMessage, message, cssHeadMessage) {
    const logMode = getLogMode.call(this);
    if (logMode === 'none')
        return;
    if (headMessage === 'Init:') {
        return console.log(`%c${message}`, `${constants_js_1.ConsoleCss[cssHeadMessage ?? headMessage]}`);
    }
    if (logMode === 'debug') {
        return console.log(`%c${headMessage}`, `${constants_js_1.ConsoleCss[cssHeadMessage ?? headMessage]}`, message);
    }
};
exports.callConsoleMessage = callConsoleMessage;
const isCore = function (value) {
    return !!value && typeof value === 'object' && 'logMode' in value;
};
exports.isCore = isCore;
const hasCore = function (value) {
    return !!value && typeof value === 'object' && 'core' in value;
};
exports.hasCore = hasCore;
//# sourceMappingURL=utils.js.map