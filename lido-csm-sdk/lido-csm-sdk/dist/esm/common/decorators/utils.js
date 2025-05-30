import { ConsoleCss } from './constants.js';
const getLogMode = function () {
    let logMode = 'info';
    if (isCore(this)) {
        logMode = this.logMode;
    }
    else if (hasCore(this)) {
        logMode = this.core.logMode;
    }
    return logMode;
};
export const callConsoleMessage = function (headMessage, message, cssHeadMessage) {
    const logMode = getLogMode.call(this);
    if (logMode === 'none')
        return;
    if (headMessage === 'Init:') {
        return console.log(`%c${message}`, `${ConsoleCss[cssHeadMessage ?? headMessage]}`);
    }
    if (logMode === 'debug') {
        return console.log(`%c${headMessage}`, `${ConsoleCss[cssHeadMessage ?? headMessage]}`, message);
    }
};
export const isCore = function (value) {
    return !!value && typeof value === 'object' && 'logMode' in value;
};
export const hasCore = function (value) {
    return !!value && typeof value === 'object' && 'core' in value;
};
//# sourceMappingURL=utils.js.map