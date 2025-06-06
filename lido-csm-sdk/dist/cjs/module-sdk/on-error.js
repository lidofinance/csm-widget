"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onError = void 0;
const viem_1 = require("viem");
const onError = (err) => {
    if (err instanceof viem_1.BaseError) {
        const revertError = err.walk((err) => err instanceof viem_1.ContractFunctionRevertedError);
        if (revertError instanceof viem_1.ContractFunctionRevertedError &&
            revertError.data === undefined) {
            return 1n;
        }
    }
    throw err;
};
exports.onError = onError;
//# sourceMappingURL=on-error.js.map