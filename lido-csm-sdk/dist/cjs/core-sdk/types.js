"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionCallbackStage = void 0;
var TransactionCallbackStage;
(function (TransactionCallbackStage) {
    TransactionCallbackStage["PERMIT_SIGN"] = "permit_sign";
    TransactionCallbackStage["APPROVE_SIGN"] = "approve_sign";
    TransactionCallbackStage["APPROVE_RECEIPT"] = "approve_receipt";
    TransactionCallbackStage["GAS_LIMIT"] = "gas_limit";
    TransactionCallbackStage["SIGN"] = "sign";
    TransactionCallbackStage["RECEIPT"] = "receipt";
    TransactionCallbackStage["CONFIRMATION"] = "confirmation";
    TransactionCallbackStage["DONE"] = "done";
    TransactionCallbackStage["MULTISIG_DONE"] = "multisig_done";
    TransactionCallbackStage["ERROR"] = "error";
})(TransactionCallbackStage || (exports.TransactionCallbackStage = TransactionCallbackStage = {}));
//# sourceMappingURL=types.js.map