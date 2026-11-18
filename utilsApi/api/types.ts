import type { ServerLogger } from '@lidofinance/api-logger';
import type { TrackedFetchRPC } from '@lidofinance/api-rpc';
import type { FetchRpcInitBody } from '@lidofinance/rpc';
import type { Counter, Registry } from 'prom-client';

export type RpcProviders = Record<string | number, [string, ...string[]]>;

export type RPCFactoryValidationParams = {
  maxBatchCount?: number;
  maxResponseSize?: number;
  allowedRPCMethods: string[];
  allowedCallAddresses: Record<number, string[]>;
  allowedLogsAddresses: Record<number, string[]>;
  blockEmptyAddressGetLogs?: boolean;
  maxGetLogsRange?: number;
  currentBlockTTLms?: number;
};

export type RPCFactoryParams = {
  metrics?: {
    prefix: string;
    registry: Registry;
  };
  providers: RpcProviders;
  fetchRPC: TrackedFetchRPC;
  defaultChain: string | number;
  validation: RPCFactoryValidationParams;
  serverLogger?: ServerLogger;
  // 0 turns the per-provider time-to-first-byte limit off
  upstreamTimeoutMs?: number;
};

export type RpcRequest = {
  method: string;
  params: unknown[];
};

export type ValidationContext = {
  chainId: number;
  rpcRequestBlocked: Counter<'reason'>;
  requestRPC: (chainId: number, body: FetchRpcInitBody) => Promise<Response>;
};
