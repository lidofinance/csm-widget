"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPTY_PERMIT = void 0;
const viem_1 = require("viem");
exports.EMPTY_PERMIT = {
    value: 0n,
    deadline: 0n,
    v: 0,
    r: viem_1.zeroHash,
    s: viem_1.zeroHash,
};
//# sourceMappingURL=permit.js.map