"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearEmptyAddress = void 0;
const viem_1 = require("viem");
const clearEmptyAddress = (address) => {
    return address !== viem_1.zeroAddress ? address : undefined;
};
exports.clearEmptyAddress = clearEmptyAddress;
//# sourceMappingURL=clear-empty-address.js.map