import { STETH_ROUNDING_THRESHOLD } from '../common/index.js';
export const calcBondBalance = ({ current, required, locked, }) => {
    const requiredWithoutLocked = required - locked;
    let delta = current - requiredWithoutLocked;
    if (delta < -STETH_ROUNDING_THRESHOLD) {
        delta = 0n;
    }
    const isInsufficient = delta < 0 || false;
    return {
        required: requiredWithoutLocked,
        current,
        locked,
        delta: delta < 0 ? -delta : delta, // TODO: may be not .abs() ???
        isInsufficient,
    };
};
//# sourceMappingURL=calc-bond-balance.js.map