import { SUPPORTED_VERSION_BY_CONTRACT } from '../common/index.js';
export type CsmStatus = {
  isPausedModule: boolean;
  isPausedAccounting: boolean;
};
export type CsmContractsWithVersion =
  keyof typeof SUPPORTED_VERSION_BY_CONTRACT;
export type CsmVersions = Record<CsmContractsWithVersion, bigint>;
//# sourceMappingURL=types.d.ts.map
