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
import { stethSharesAbi } from '@lidofinance/lido-ethereum-sdk';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { ErrorHandler, Logger } from '../common/decorators/index.js';
import { CSM_CONTRACT_NAMES, EXTERNAL_LINKS, LINK_TYPE, } from '../common/index.js';
import { fetchRewardsTree, fetchWithFallback } from './fetch-rewards-tree.js';
import { EMPTY_PROOF, findProofAndAmount } from './find-proof.js';
let RewardsSDK = (() => {
    var _a;
    let _classSuper = CsmSDKModule;
    let _instanceExtraInitializers = [];
    let _getProofTreeUrls_decorators;
    let _getProofTree_decorators;
    let _getProof_decorators;
    let _getAvailable_decorators;
    let _getRewards_decorators;
    let _sharesToEth_decorators;
    return _a = class RewardsSDK extends _classSuper {
            get contract() {
                return this.core.getContractCSFeeDistributor();
            }
            getProofTreeUrls(cid) {
                return [
                    EXTERNAL_LINKS[this.core.chainId]?.[LINK_TYPE.rewardsTree],
                    `https://ipfs.io/ipfs/${cid}`,
                ].filter((v) => v !== undefined);
            }
            async getProofTree() {
                const [root, cid] = await Promise.all([
                    this.contract.read.treeRoot(),
                    this.contract.read.treeCid(),
                ]);
                const urls = this.getProofTreeUrls(cid);
                return fetchWithFallback(urls, (url) => fetchRewardsTree(url, root));
            }
            async getProof(nodeOperatorId) {
                const proofTree = await this.getProofTree();
                if (!proofTree)
                    return EMPTY_PROOF;
                return findProofAndAmount(proofTree, nodeOperatorId);
            }
            async getAvailable(nodeOperatorId, { proof, shares }) {
                if (proof.length === 0)
                    return 0n;
                const available = await this.contract.read.getFeesToDistribute([
                    nodeOperatorId,
                    shares,
                    proof,
                ]);
                return await this.sharesToEth(available);
            }
            async getRewards(nodeOperatorId) {
                const proofs = await this.getProof(nodeOperatorId);
                const available = await this.getAvailable(nodeOperatorId, proofs);
                return {
                    ...proofs,
                    available,
                };
            }
            async sharesToEth(amount) {
                const contract = this.core.getContract(CSM_CONTRACT_NAMES.stETH, stethSharesAbi);
                return contract.read.getPooledEthByShares([amount]);
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _getProofTreeUrls_decorators = [Logger('Utils:')];
            _getProofTree_decorators = [Logger('Views:'), ErrorHandler()];
            _getProof_decorators = [Logger('Utils:')];
            _getAvailable_decorators = [Logger('Views:'), ErrorHandler()];
            _getRewards_decorators = [Logger('Utils:')];
            _sharesToEth_decorators = [Logger('Views:'), ErrorHandler()];
            __esDecorate(_a, null, _getProofTreeUrls_decorators, { kind: "method", name: "getProofTreeUrls", static: false, private: false, access: { has: obj => "getProofTreeUrls" in obj, get: obj => obj.getProofTreeUrls }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getProofTree_decorators, { kind: "method", name: "getProofTree", static: false, private: false, access: { has: obj => "getProofTree" in obj, get: obj => obj.getProofTree }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getProof_decorators, { kind: "method", name: "getProof", static: false, private: false, access: { has: obj => "getProof" in obj, get: obj => obj.getProof }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getAvailable_decorators, { kind: "method", name: "getAvailable", static: false, private: false, access: { has: obj => "getAvailable" in obj, get: obj => obj.getAvailable }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getRewards_decorators, { kind: "method", name: "getRewards", static: false, private: false, access: { has: obj => "getRewards" in obj, get: obj => obj.getRewards }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _sharesToEth_decorators, { kind: "method", name: "sharesToEth", static: false, private: false, access: { has: obj => "sharesToEth" in obj, get: obj => obj.sharesToEth }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
export { RewardsSDK };
//# sourceMappingURL=rewards-sdk.js.map