"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcBondBalance = void 0;
const index_js_1 = require("../common/index.js");
const calcBondBalance = ({ current, required, locked, }) => {
    const requiredWithoutLocked = required - locked;
    let delta = current - requiredWithoutLocked;
    if (delta < -index_js_1.STETH_ROUNDING_THRESHOLD) {
        delta = 0n;
    }
    const isInsufficient = delta < 0 || false;
    return {
        required: requiredWithoutLocked,
        current,
        locked,
        delta: delta < 0 ? -delta : delta,
        isInsufficient,
    };
};
exports.calcBondBalance = calcBondBalance;
//# sourceMappingURL=calc-bond-balance.js.map