"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERCENT_BASIS = exports.SUPPORTED_VERSION_BY_CONTRACT = exports.DEPLOYMENT_BLOCK_NUMBER_BY_CHAIN = exports.MODULE_ID_BY_CHAIN = exports.CSM_CONTRACT_ADDRESSES = exports.CSM_CONTRACT_NAMES = exports.CSM_SUPPORTED_CHAINS = void 0;
const lido_ethereum_sdk_1 = require("@lidofinance/lido-ethereum-sdk");
const tokens_js_1 = require("./tokens.js");
exports.CSM_SUPPORTED_CHAINS = [lido_ethereum_sdk_1.CHAINS.Mainnet, lido_ethereum_sdk_1.CHAINS.Hoodi];
var CSM_CONTRACT_NAMES;
(function (CSM_CONTRACT_NAMES) {
    CSM_CONTRACT_NAMES["csAccounting"] = "csAccounting";
    CSM_CONTRACT_NAMES["csEjector"] = "csEjector";
    CSM_CONTRACT_NAMES["csFeeDistributor"] = "csFeeDistributor";
    CSM_CONTRACT_NAMES["csFeeOracle"] = "csFeeOracle";
    CSM_CONTRACT_NAMES["csModule"] = "csModule";
    CSM_CONTRACT_NAMES["csParametersRegistry"] = "csParametersRegistry";
    CSM_CONTRACT_NAMES["csStrikes"] = "csStrikes";
    CSM_CONTRACT_NAMES["csVerifier"] = "csVerifier";
    CSM_CONTRACT_NAMES["hashConsensus"] = "hashConsensus";
    CSM_CONTRACT_NAMES["permissionlessGate"] = "permissionlessGate";
    CSM_CONTRACT_NAMES["vettedGate"] = "vettedGate";
    CSM_CONTRACT_NAMES["stakingRouter"] = "stakingRouter";
    CSM_CONTRACT_NAMES["validatorsExitBusOracle"] = "validatorsExitBusOracle";
    CSM_CONTRACT_NAMES["withdrawalVault"] = "withdrawalVault";
    CSM_CONTRACT_NAMES["stETH"] = "stETH";
    CSM_CONTRACT_NAMES["wstETH"] = "wstETH";
})(CSM_CONTRACT_NAMES || (exports.CSM_CONTRACT_NAMES = CSM_CONTRACT_NAMES = {}));
exports.CSM_CONTRACT_ADDRESSES = {
    [lido_ethereum_sdk_1.CHAINS.Mainnet]: {
        [CSM_CONTRACT_NAMES.csAccounting]: '0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da',
        [CSM_CONTRACT_NAMES.csFeeDistributor]: '0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0',
        [CSM_CONTRACT_NAMES.csFeeOracle]: '0x4D4074628678Bd302921c20573EEa1ed38DdF7FB',
        [CSM_CONTRACT_NAMES.csModule]: '0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F',
        [CSM_CONTRACT_NAMES.csVerifier]: '0x3Dfc50f22aCA652a0a6F28a0F892ab62074b5583',
        [CSM_CONTRACT_NAMES.hashConsensus]: '0x71093efF8D8599b5fA340D665Ad60fA7C80688e4',
        [CSM_CONTRACT_NAMES.validatorsExitBusOracle]: '0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e',
        [CSM_CONTRACT_NAMES.stakingRouter]: '0xFdDf38947aFB03C621C71b06C9C70bce73f12999',
        [CSM_CONTRACT_NAMES.withdrawalVault]: '0xB9D7934878B5FB9610B3fE8A5e441e8fad7E293f',
        [tokens_js_1.TOKENS.steth]: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
        [tokens_js_1.TOKENS.wsteth]: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    },
    [lido_ethereum_sdk_1.CHAINS.Hoodi]: {
        [CSM_CONTRACT_NAMES.csAccounting]: '0xA54b90BA34C5f326BC1485054080994e38FB4C60',
        [CSM_CONTRACT_NAMES.csFeeDistributor]: '0xaCd9820b0A2229a82dc1A0770307ce5522FF3582',
        [CSM_CONTRACT_NAMES.csFeeOracle]: '0xe7314f561B2e72f9543F1004e741bab6Fc51028B',
        [CSM_CONTRACT_NAMES.csModule]: '0x79CEf36D84743222f37765204Bec41E92a93E59d',
        [CSM_CONTRACT_NAMES.csVerifier]: '0x16D0f6068D211608e3703323314aa976a6492D09',
        [CSM_CONTRACT_NAMES.hashConsensus]: '0x54f74a10e4397dDeF85C4854d9dfcA129D72C637',
        [CSM_CONTRACT_NAMES.validatorsExitBusOracle]: '0x8664d394C2B3278F26A1B44B967aEf99707eeAB2',
        [CSM_CONTRACT_NAMES.stakingRouter]: '0xCc820558B39ee15C7C45B59390B503b83fb499A8',
        [CSM_CONTRACT_NAMES.withdrawalVault]: '0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2',
        [tokens_js_1.TOKENS.steth]: '0x3508A952176b3c15387C97BE809eaffB1982176a',
        [tokens_js_1.TOKENS.wsteth]: '0x7E99eE3C66636DE415D2d7C880938F2f40f94De4',
    },
};
exports.MODULE_ID_BY_CHAIN = {
    [lido_ethereum_sdk_1.CHAINS.Mainnet]: 3,
    [lido_ethereum_sdk_1.CHAINS.Hoodi]: 4,
};
exports.DEPLOYMENT_BLOCK_NUMBER_BY_CHAIN = {
    [lido_ethereum_sdk_1.CHAINS.Mainnet]: BigInt('0x13f7326'),
    [lido_ethereum_sdk_1.CHAINS.Hoodi]: BigInt('0x1374'),
};
exports.SUPPORTED_VERSION_BY_CONTRACT = {
    [CSM_CONTRACT_NAMES.csAccounting]: 2n,
    [CSM_CONTRACT_NAMES.csFeeDistributor]: 2n,
    [CSM_CONTRACT_NAMES.csModule]: 2n,
};
exports.PERCENT_BASIS = 10000n;
//# sourceMappingURL=base.js.map