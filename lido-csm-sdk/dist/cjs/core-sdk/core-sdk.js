"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreSDK = void 0;
const lido_ethereum_sdk_1 = require("@lidofinance/lido-ethereum-sdk");
const viem_1 = require("viem");
const index_js_1 = require("../abi/index.js");
const csm_sdk_cacheable_js_1 = require("../common/class-primitives/csm-sdk-cacheable.js");
const index_js_2 = require("../common/decorators/index.js");
const index_js_3 = require("../common/index.js");
const types_js_1 = require("./types.js");
let CoreSDK = (() => {
    var _a;
    let _classSuper = csm_sdk_cacheable_js_1.CsmSDKCacheable;
    let _instanceExtraInitializers = [];
    let _getContractAddress_decorators;
    let _getContractCSAccounting_decorators;
    let _getContractCSEjector_decorators;
    let _getContractCSFeeDistributor_decorators;
    let _getContractCSFeeOracle_decorators;
    let _getContractCSModule_decorators;
    let _getContractCSParametersRegistry_decorators;
    let _getContractCSStrikes_decorators;
    let _getContractCSVerifier_decorators;
    let _getContractHashConsensus_decorators;
    let _getContractPermissionlessGate_decorators;
    let _getContractVettedGate_decorators;
    let _getContractStakingRouter_decorators;
    let _getContractValidatorsExitBusOracle_decorators;
    return _a = class CoreSDK extends _classSuper {
            constructor(props) {
                super();
                Object.defineProperty(this, "core", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: __runInitializers(this, _instanceExtraInitializers)
                });
                Object.defineProperty(this, "overridedAddresses", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: void 0
                });
                this.core = props.core;
                this.overridedAddresses = props.overridedAddresses;
            }
            get chainId() {
                return this.core.chain.id;
            }
            get chain() {
                return this.core.chain;
            }
            get logMode() {
                return this.core.logMode;
            }
            getContractAddress(contract) {
                const address = this.overridedAddresses?.[contract] ??
                    index_js_3.CSM_CONTRACT_ADDRESSES[this.chainId]?.[contract];
                (0, lido_ethereum_sdk_1.invariant)(address, `CSM contracts are not supported for ${this.core.chain.name}(${this.core.chain.id})`, lido_ethereum_sdk_1.ERROR_CODE.NOT_SUPPORTED);
                return address;
            }
            getContract(contractName, abi) {
                return (0, viem_1.getContract)({
                    address: this.getContractAddress(contractName),
                    abi,
                    client: {
                        public: this.core.rpcProvider,
                        wallet: this.core.web3Provider,
                    },
                });
            }
            getContractCSAccounting() {
                return this.getContract(index_js_3.CSM_CONTRACT_NAMES.csAccounting, index_js_1.CSAccountingAbi);
            }
            getContractCSEjector() {
                return this.getContract(index_js_3.CSM_CONTRACT_NAMES.csEjector, index_js_1.CSEjectorAbi);
            }
            getContractCSFeeDistributor() {
                return this.getContract(index_js_3.CSM_CONTRACT_NAMES.csFeeDistributor, index_js_1.CSFeeDistributorAbi);
            }
            getContractCSFeeOracle() {
                return this.getContract(index_js_3.CSM_CONTRACT_NAMES.csFeeOracle, index_js_1.CSFeeOracleAbi);
            }
            getContractCSModule() {
                return this.getContract(index_js_3.CSM_CONTRACT_NAMES.csModule, index_js_1.CSModuleAbi);
            }
            getContractCSParametersRegistry() {
                return this.getContract(index_js_3.CSM_CONTRACT_NAMES.csParametersRegistry, index_js_1.CSParametersRegistryAbi);
            }
            getContractCSStrikes() {
                return this.getContract(index_js_3.CSM_CONTRACT_NAMES.csStrikes, index_js_1.CSStrikesAbi);
            }
            getContractCSVerifier() {
                return this.getContract(index_js_3.CSM_CONTRACT_NAMES.csVerifier, index_js_1.CSVerifierAbi);
            }
            getContractHashConsensus() {
                return this.getContract(index_js_3.CSM_CONTRACT_NAMES.hashConsensus, index_js_1.HashConsensusAbi);
            }
            getContractPermissionlessGate() {
                return this.getContract(index_js_3.CSM_CONTRACT_NAMES.permissionlessGate, index_js_1.PermissionlessGateAbi);
            }
            getContractVettedGate() {
                return this.getContract(index_js_3.CSM_CONTRACT_NAMES.vettedGate, index_js_1.VettedGateAbi);
            }
            getContractStakingRouter() {
                return this.getContract(index_js_3.CSM_CONTRACT_NAMES.stakingRouter, index_js_1.StakingRouterAbi);
            }
            getContractValidatorsExitBusOracle() {
                return this.getContract(index_js_3.CSM_CONTRACT_NAMES.validatorsExitBusOracle, index_js_1.ValidatorsExitBusOracleAbi);
            }
            async performTransaction(props) {
                this.core.useWeb3Provider();
                const { callback = lido_ethereum_sdk_1.NOOP, getGasLimit, sendTransaction, decodeResult, waitForTransactionReceiptParameters = {}, } = props;
                const account = await this.core.useAccount(props.account);
                const isContract = await this.core.isContract(account.address);
                let overrides = {
                    account,
                    chain: this.core.chain,
                    gas: undefined,
                    maxFeePerGas: undefined,
                    maxPriorityFeePerGas: undefined,
                };
                if (isContract) {
                    overrides = {
                        ...overrides,
                        gas: 21000n,
                        maxFeePerGas: 1n,
                        maxPriorityFeePerGas: 1n,
                        nonce: 1,
                    };
                }
                else {
                    await callback({ stage: types_js_1.TransactionCallbackStage.GAS_LIMIT });
                    const feeData = await this.core.getFeeData();
                    overrides.maxFeePerGas = feeData.maxFeePerGas;
                    overrides.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
                    try {
                        overrides.gas = await getGasLimit({ ...overrides });
                    }
                    catch {
                        await (0, lido_ethereum_sdk_1.withSDKError)(getGasLimit({
                            ...overrides,
                            maxFeePerGas: undefined,
                            maxPriorityFeePerGas: undefined,
                        }), lido_ethereum_sdk_1.ERROR_CODE.TRANSACTION_ERROR);
                        throw this.core.error({
                            code: lido_ethereum_sdk_1.ERROR_CODE.TRANSACTION_ERROR,
                            message: 'Not enough ether for gas',
                        });
                    }
                }
                const customGas = await callback({
                    stage: types_js_1.TransactionCallbackStage.SIGN,
                    payload: { gas: overrides.gas },
                });
                if (typeof customGas === 'bigint')
                    overrides.gas = customGas;
                const hash = await (0, lido_ethereum_sdk_1.withSDKError)(sendTransaction({
                    ...overrides,
                }), lido_ethereum_sdk_1.ERROR_CODE.TRANSACTION_ERROR);
                if (isContract) {
                    await callback({ stage: types_js_1.TransactionCallbackStage.MULTISIG_DONE });
                    return { hash };
                }
                await callback({
                    stage: types_js_1.TransactionCallbackStage.RECEIPT,
                    payload: { hash },
                });
                const receipt = await (0, lido_ethereum_sdk_1.withSDKError)(this.core.rpcProvider.waitForTransactionReceipt({
                    hash,
                    timeout: 120_000,
                    ...waitForTransactionReceiptParameters,
                }), lido_ethereum_sdk_1.ERROR_CODE.TRANSACTION_ERROR);
                await callback({
                    stage: types_js_1.TransactionCallbackStage.CONFIRMATION,
                    payload: { receipt, hash },
                });
                const confirmations = await this.core.rpcProvider.getTransactionConfirmations({
                    hash: receipt.transactionHash,
                });
                const result = await decodeResult?.(receipt);
                await callback({
                    stage: types_js_1.TransactionCallbackStage.DONE,
                    payload: {
                        result: result,
                        confirmations,
                        receipt,
                        hash,
                    },
                });
                return {
                    hash,
                    receipt,
                    result,
                    confirmations,
                };
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _getContractAddress_decorators = [(0, index_js_2.Logger)('Utils:'), (0, index_js_2.Cache)(30 * 60 * 1000)];
            _getContractCSAccounting_decorators = [(0, index_js_2.Logger)('Contracts:'), (0, index_js_2.Cache)(30 * 60 * 1000)];
            _getContractCSEjector_decorators = [(0, index_js_2.Logger)('Contracts:'), (0, index_js_2.Cache)(30 * 60 * 1000)];
            _getContractCSFeeDistributor_decorators = [(0, index_js_2.Logger)('Contracts:'), (0, index_js_2.Cache)(30 * 60 * 1000)];
            _getContractCSFeeOracle_decorators = [(0, index_js_2.Logger)('Contracts:'), (0, index_js_2.Cache)(30 * 60 * 1000)];
            _getContractCSModule_decorators = [(0, index_js_2.Logger)('Contracts:'), (0, index_js_2.Cache)(30 * 60 * 1000)];
            _getContractCSParametersRegistry_decorators = [(0, index_js_2.Logger)('Contracts:'), (0, index_js_2.Cache)(30 * 60 * 1000)];
            _getContractCSStrikes_decorators = [(0, index_js_2.Logger)('Contracts:'), (0, index_js_2.Cache)(30 * 60 * 1000)];
            _getContractCSVerifier_decorators = [(0, index_js_2.Logger)('Contracts:'), (0, index_js_2.Cache)(30 * 60 * 1000)];
            _getContractHashConsensus_decorators = [(0, index_js_2.Logger)('Contracts:'), (0, index_js_2.Cache)(30 * 60 * 1000)];
            _getContractPermissionlessGate_decorators = [(0, index_js_2.Logger)('Contracts:'), (0, index_js_2.Cache)(30 * 60 * 1000)];
            _getContractVettedGate_decorators = [(0, index_js_2.Logger)('Contracts:'), (0, index_js_2.Cache)(30 * 60 * 1000)];
            _getContractStakingRouter_decorators = [(0, index_js_2.Logger)('Contracts:'), (0, index_js_2.Cache)(30 * 60 * 1000)];
            _getContractValidatorsExitBusOracle_decorators = [(0, index_js_2.Logger)('Contracts:'), (0, index_js_2.Cache)(30 * 60 * 1000)];
            __esDecorate(_a, null, _getContractAddress_decorators, { kind: "method", name: "getContractAddress", static: false, private: false, access: { has: obj => "getContractAddress" in obj, get: obj => obj.getContractAddress }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getContractCSAccounting_decorators, { kind: "method", name: "getContractCSAccounting", static: false, private: false, access: { has: obj => "getContractCSAccounting" in obj, get: obj => obj.getContractCSAccounting }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getContractCSEjector_decorators, { kind: "method", name: "getContractCSEjector", static: false, private: false, access: { has: obj => "getContractCSEjector" in obj, get: obj => obj.getContractCSEjector }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getContractCSFeeDistributor_decorators, { kind: "method", name: "getContractCSFeeDistributor", static: false, private: false, access: { has: obj => "getContractCSFeeDistributor" in obj, get: obj => obj.getContractCSFeeDistributor }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getContractCSFeeOracle_decorators, { kind: "method", name: "getContractCSFeeOracle", static: false, private: false, access: { has: obj => "getContractCSFeeOracle" in obj, get: obj => obj.getContractCSFeeOracle }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getContractCSModule_decorators, { kind: "method", name: "getContractCSModule", static: false, private: false, access: { has: obj => "getContractCSModule" in obj, get: obj => obj.getContractCSModule }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getContractCSParametersRegistry_decorators, { kind: "method", name: "getContractCSParametersRegistry", static: false, private: false, access: { has: obj => "getContractCSParametersRegistry" in obj, get: obj => obj.getContractCSParametersRegistry }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getContractCSStrikes_decorators, { kind: "method", name: "getContractCSStrikes", static: false, private: false, access: { has: obj => "getContractCSStrikes" in obj, get: obj => obj.getContractCSStrikes }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getContractCSVerifier_decorators, { kind: "method", name: "getContractCSVerifier", static: false, private: false, access: { has: obj => "getContractCSVerifier" in obj, get: obj => obj.getContractCSVerifier }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getContractHashConsensus_decorators, { kind: "method", name: "getContractHashConsensus", static: false, private: false, access: { has: obj => "getContractHashConsensus" in obj, get: obj => obj.getContractHashConsensus }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getContractPermissionlessGate_decorators, { kind: "method", name: "getContractPermissionlessGate", static: false, private: false, access: { has: obj => "getContractPermissionlessGate" in obj, get: obj => obj.getContractPermissionlessGate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getContractVettedGate_decorators, { kind: "method", name: "getContractVettedGate", static: false, private: false, access: { has: obj => "getContractVettedGate" in obj, get: obj => obj.getContractVettedGate }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getContractStakingRouter_decorators, { kind: "method", name: "getContractStakingRouter", static: false, private: false, access: { has: obj => "getContractStakingRouter" in obj, get: obj => obj.getContractStakingRouter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getContractValidatorsExitBusOracle_decorators, { kind: "method", name: "getContractValidatorsExitBusOracle", static: false, private: false, access: { has: obj => "getContractValidatorsExitBusOracle" in obj, get: obj => obj.getContractValidatorsExitBusOracle }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CoreSDK = CoreSDK;
//# sourceMappingURL=core-sdk.js.map