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
import { ERROR_CODE, invariant, NOOP, TransactionCallbackStage, withSDKError, } from '@lidofinance/lido-ethereum-sdk';
import { getContract, } from 'viem';
import { CSAccountingAbi, CSEjectorAbi, CSFeeDistributorAbi, CSFeeOracleAbi, CSModuleAbi, CSParametersRegistryAbi, CSStrikesAbi, CSVerifierAbi, HashConsensusAbi, PermissionlessGateAbi, StakingRouterAbi, ValidatorsExitBusOracleAbi, VettedGateAbi, } from '../abi/index.js';
import { CsmSDKCacheable } from '../common/class-primitives/csm-sdk-cacheable.js';
import { Cache, Logger } from '../common/decorators/index.js';
import { CSM_CONTRACT_ADDRESSES, CSM_CONTRACT_NAMES, } from '../common/index.js';
let CoreSDK = (() => {
    var _a;
    let _classSuper = CsmSDKCacheable;
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
                    CSM_CONTRACT_ADDRESSES[this.chainId]?.[contract];
                invariant(address, `CSM contracts are not supported for ${this.core.chain.name}(${this.core.chain.id})`, ERROR_CODE.NOT_SUPPORTED);
                return address;
            }
            getContract(contractName, abi) {
                return getContract({
                    address: this.getContractAddress(contractName),
                    abi,
                    client: {
                        public: this.core.rpcProvider,
                        wallet: this.core.web3Provider,
                    },
                });
            }
            getContractCSAccounting() {
                return this.getContract(CSM_CONTRACT_NAMES.csAccounting, CSAccountingAbi);
            }
            getContractCSEjector() {
                return this.getContract(CSM_CONTRACT_NAMES.csEjector, CSEjectorAbi);
            }
            getContractCSFeeDistributor() {
                return this.getContract(CSM_CONTRACT_NAMES.csFeeDistributor, CSFeeDistributorAbi);
            }
            getContractCSFeeOracle() {
                return this.getContract(CSM_CONTRACT_NAMES.csFeeOracle, CSFeeOracleAbi);
            }
            getContractCSModule() {
                return this.getContract(CSM_CONTRACT_NAMES.csModule, CSModuleAbi);
            }
            getContractCSParametersRegistry() {
                return this.getContract(CSM_CONTRACT_NAMES.csParametersRegistry, CSParametersRegistryAbi);
            }
            getContractCSStrikes() {
                return this.getContract(CSM_CONTRACT_NAMES.csStrikes, CSStrikesAbi);
            }
            getContractCSVerifier() {
                return this.getContract(CSM_CONTRACT_NAMES.csVerifier, CSVerifierAbi);
            }
            getContractHashConsensus() {
                return this.getContract(CSM_CONTRACT_NAMES.hashConsensus, HashConsensusAbi);
            }
            getContractPermissionlessGate() {
                return this.getContract(CSM_CONTRACT_NAMES.permissionlessGate, PermissionlessGateAbi);
            }
            getContractVettedGate() {
                return this.getContract(CSM_CONTRACT_NAMES.vettedGate, VettedGateAbi);
            }
            getContractStakingRouter() {
                return this.getContract(CSM_CONTRACT_NAMES.stakingRouter, StakingRouterAbi);
            }
            getContractValidatorsExitBusOracle() {
                return this.getContract(CSM_CONTRACT_NAMES.validatorsExitBusOracle, ValidatorsExitBusOracleAbi);
            }
            async performTransaction(props) {
                // this guards against not having web3Provider
                this.core.useWeb3Provider();
                const { callback = NOOP, getGasLimit, sendTransaction, decodeResult, waitForTransactionReceiptParameters = {}, } = props;
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
                    // passing these stub params prevent unnecessary possibly errorish RPC calls
                    overrides = {
                        ...overrides,
                        gas: 21000n,
                        maxFeePerGas: 1n,
                        maxPriorityFeePerGas: 1n,
                        nonce: 1,
                    };
                }
                else {
                    await callback({ stage: TransactionCallbackStage.GAS_LIMIT });
                    const feeData = await this.core.getFeeData();
                    overrides.maxFeePerGas = feeData.maxFeePerGas;
                    overrides.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
                    try {
                        overrides.gas = await getGasLimit({ ...overrides });
                    }
                    catch {
                        // we retry without fees to see if tx will go trough
                        await withSDKError(getGasLimit({
                            ...overrides,
                            maxFeePerGas: undefined,
                            maxPriorityFeePerGas: undefined,
                        }), ERROR_CODE.TRANSACTION_ERROR);
                        throw this.core.error({
                            code: ERROR_CODE.TRANSACTION_ERROR,
                            message: 'Not enough ether for gas',
                        });
                    }
                }
                const customGas = await callback({
                    stage: TransactionCallbackStage.SIGN,
                    payload: { gas: overrides.gas },
                });
                if (typeof customGas === 'bigint')
                    overrides.gas = customGas;
                const hash = await withSDKError(sendTransaction({
                    ...overrides,
                }), ERROR_CODE.TRANSACTION_ERROR);
                if (isContract) {
                    await callback({ stage: TransactionCallbackStage.MULTISIG_DONE });
                    return { hash };
                }
                await callback({
                    stage: TransactionCallbackStage.RECEIPT,
                    payload: { hash },
                });
                const receipt = await withSDKError(this.core.rpcProvider.waitForTransactionReceipt({
                    hash,
                    timeout: 120_000,
                    ...waitForTransactionReceiptParameters,
                }), ERROR_CODE.TRANSACTION_ERROR);
                await callback({
                    stage: TransactionCallbackStage.CONFIRMATION,
                    payload: { receipt, hash },
                });
                const confirmations = await this.core.rpcProvider.getTransactionConfirmations({
                    hash: receipt.transactionHash,
                });
                const result = await decodeResult?.(receipt);
                await callback({
                    stage: TransactionCallbackStage.DONE,
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
            _getContractAddress_decorators = [Logger('Utils:'), Cache(30 * 60 * 1000)];
            _getContractCSAccounting_decorators = [Logger('Contracts:'), Cache(30 * 60 * 1000)];
            _getContractCSEjector_decorators = [Logger('Contracts:'), Cache(30 * 60 * 1000)];
            _getContractCSFeeDistributor_decorators = [Logger('Contracts:'), Cache(30 * 60 * 1000)];
            _getContractCSFeeOracle_decorators = [Logger('Contracts:'), Cache(30 * 60 * 1000)];
            _getContractCSModule_decorators = [Logger('Contracts:'), Cache(30 * 60 * 1000)];
            _getContractCSParametersRegistry_decorators = [Logger('Contracts:'), Cache(30 * 60 * 1000)];
            _getContractCSStrikes_decorators = [Logger('Contracts:'), Cache(30 * 60 * 1000)];
            _getContractCSVerifier_decorators = [Logger('Contracts:'), Cache(30 * 60 * 1000)];
            _getContractHashConsensus_decorators = [Logger('Contracts:'), Cache(30 * 60 * 1000)];
            _getContractPermissionlessGate_decorators = [Logger('Contracts:'), Cache(30 * 60 * 1000)];
            _getContractVettedGate_decorators = [Logger('Contracts:'), Cache(30 * 60 * 1000)];
            _getContractStakingRouter_decorators = [Logger('Contracts:'), Cache(30 * 60 * 1000)];
            _getContractValidatorsExitBusOracle_decorators = [Logger('Contracts:'), Cache(30 * 60 * 1000)];
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
export { CoreSDK };
//# sourceMappingURL=core-sdk.js.map