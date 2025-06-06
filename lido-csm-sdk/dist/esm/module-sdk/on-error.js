import { BaseError, ContractFunctionRevertedError } from 'viem';
export const onError = (err) => {
    if (err instanceof BaseError) {
        const revertError = err.walk((err) => err instanceof ContractFunctionRevertedError);
        if (revertError instanceof ContractFunctionRevertedError &&
            revertError.data === undefined) {
            return 1n;
        }
    }
    throw err;
};
//# sourceMappingURL=on-error.js.map