import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
export var LINK_TYPE;
(function (LINK_TYPE) {
    LINK_TYPE["rewardsTree"] = "rewardsTree";
    LINK_TYPE["keysApi"] = "keysApi";
})(LINK_TYPE || (LINK_TYPE = {}));
export const EXTERNAL_LINKS = {
    [CHAINS.Mainnet]: {
        [LINK_TYPE.rewardsTree]: 'https://raw.githubusercontent.com/lidofinance/csm-rewards/mainnet/tree.json',
        [LINK_TYPE.keysApi]: 'https://keys-api.lido.fi',
    },
    [CHAINS.Hoodi]: {
        [LINK_TYPE.rewardsTree]: 'https://raw.githubusercontent.com/lidofinance/csm-rewards/hoodi/tree.json',
        [LINK_TYPE.keysApi]: 'https://keys-api-hoodi.testnet.fi',
    },
};
//# sourceMappingURL=links.js.map