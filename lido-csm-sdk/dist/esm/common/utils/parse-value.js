import { parseEther } from 'viem';
import { isBigint } from './is-bigint.js';
export const parseValue = (value) => {
    if (isBigint(value))
        return value;
    return parseEther(value, 'wei');
};
//# sourceMappingURL=parse-value.js.map