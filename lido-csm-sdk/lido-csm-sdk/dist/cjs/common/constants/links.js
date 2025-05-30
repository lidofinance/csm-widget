"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTERNAL_LINKS = exports.LINK_TYPE = void 0;
const lido_ethereum_sdk_1 = require("@lidofinance/lido-ethereum-sdk");
var LINK_TYPE;
(function (LINK_TYPE) {
    LINK_TYPE["rewardsTree"] = "rewardsTree";
    LINK_TYPE["keysApi"] = "keysApi";
})(LINK_TYPE || (exports.LINK_TYPE = LINK_TYPE = {}));
exports.EXTERNAL_LINKS = {
    [lido_ethereum_sdk_1.CHAINS.Mainnet]: {
        [LINK_TYPE.rewardsTree]: 'https://raw.githubusercontent.com/lidofinance/csm-rewards/mainnet/tree.json',
        [LINK_TYPE.keysApi]: 'https://keys-api.lido.fi',
    },
    [lido_ethereum_sdk_1.CHAINS.Hoodi]: {
        [LINK_TYPE.rewardsTree]: 'https://raw.githubusercontent.com/lidofinance/csm-rewards/hoodi/tree.json',
        [LINK_TYPE.keysApi]: 'https://keys-api-hoodi.testnet.fi',
    },
};
//# sourceMappingURL=links.js.map