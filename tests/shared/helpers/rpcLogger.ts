import type { Page } from '@playwright/test';
import { createRequire } from 'node:module';
import { toFunctionSelector } from 'viem';
import { CHAINS, LIDO_LOCATOR_BY_CHAIN } from '@lidofinance/lido-ethereum-sdk';
import {
  COMMON_ADDRESSES,
  MODULE_CONFIG,
  MODULE_NAME,
} from '@lidofinance/lido-csm-sdk';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const _require = createRequire(import.meta.url);

// Same address on every chain
const CHAIN_AGNOSTIC: Record<string, string> = {
  '0xca11bde05977b3631167028862be2a173976ca11': 'Multicall3',
  '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e': 'ENSRegistry',
  '0xeeeeeeee14d718c2b47d9923deab1335e144eeee': 'ENSUniversalResolver',
};

// Mainnet-only contracts the SDK config doesn't expose
const EXTRA_BY_CHAIN: Partial<Record<CHAINS, Record<string, string>>> = {
  [CHAINS.Mainnet]: {
    '0x889edc2edab5f40e902b864ad4d7ade8e412f9b1': 'WithdrawalQueue',
    '0xa2f987a546d4cd1c607ee8141276876c26b72bdf': 'AragonAgent',
  },
};

const buildContractMap = (chainId: CHAINS): Record<string, string> => {
  const map: Record<string, string> = { ...CHAIN_AGNOSTIC };

  const add = (name: string, address?: string) => {
    if (address) map[address.toLowerCase()] = name;
  };

  for (const [name, address] of Object.entries(
    COMMON_ADDRESSES[chainId as keyof typeof COMMON_ADDRESSES] ?? {},
  )) {
    add(name, address as string);
  }

  add('LidoLocator', LIDO_LOCATOR_BY_CHAIN[chainId]);

  // Both modules share contract names (accounting, feeOracle, …) — prefix them
  for (const moduleName of Object.values(MODULE_NAME)) {
    const perChain = MODULE_CONFIG[moduleName] as Record<
      number,
      { contractAddresses: Record<string, string> } | undefined
    >;
    const config = perChain[chainId];
    if (!config) continue;
    for (const [name, address] of Object.entries(config.contractAddresses)) {
      add(`${moduleName}:${name}`, address);
    }
  }

  Object.assign(map, EXTRA_BY_CHAIN[chainId] ?? {});

  return map;
};

const TOPICS: Record<string, string> = {
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef':
    'Transfer',
  '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925':
    'Approval',
};

// Lido core / multicall functions that aren't in the CSM SDK ABIs
const EXTRA_SIGNATURES = [
  'function submit(address)',
  'function wrap(uint256)',
  'function unwrap(uint256)',
  'function requestWithdrawals(uint256[],address)',
  'function requestWithdrawalsWstETH(uint256[],address)',
  'function getWithdrawalRequests(address)',
  'function getWithdrawalStatus(uint256[])',
  'function getSharesByPooledEth(uint256)',
  'function getPooledEthByShares(uint256)',
  'function sharesOf(address)',
  'function getTotalPooledEther()',
  'function getStakeLimitFullInfo()',
  'function aggregate3((address,bool,bytes)[])',
  'function aggregate((address,bytes)[])',
  // ENS (wagmi resolves the connected address to a name)
  'function resolve(bytes,bytes)',
  'function resolveWithGateways(bytes,bytes,string[])',
  'function reverse(bytes,uint256)',
  'function reverseWithGateways(bytes,uint256,string[])',
  'function findResolver(bytes)',
];

const buildSelectorMap = (): Record<string, string> => {
  const sdkAbi = _require('@lidofinance/lido-csm-sdk/abi') as Record<
    string,
    readonly { type: string; name: string }[]
  >;
  const abis = Object.values(sdkAbi).filter(Array.isArray);

  const map: Record<string, string> = {
    // ERC20
    '0x70a08231': 'balanceOf',
    '0x18160ddd': 'totalSupply',
    '0x095ea7b3': 'approve',
    '0xa9059cbb': 'transfer',
    '0x23b872dd': 'transferFrom',
    '0xdd62ed3e': 'allowance',
  };

  for (const signature of EXTRA_SIGNATURES) {
    try {
      const selector = toFunctionSelector(signature);
      if (!map[selector]) map[selector] = signature.slice(9).split('(')[0];
    } catch {
      // skip unparseable signatures
    }
  }

  for (const abi of abis) {
    for (const item of abi) {
      if (item.type !== 'function') continue;
      try {
        const selector = toFunctionSelector(item as never);
        if (!map[selector]) map[selector] = item.name;
      } catch {
        // skip unparseable items
      }
    }
  }

  return map;
};

const SELECTORS = buildSelectorMap();

const fnName = (selector: string) =>
  SELECTORS[selector.toLowerCase()] ?? selector;

const createDecoder = (contracts: Record<string, string>) => {
  const contractName = (addr: string) => contracts[addr.toLowerCase()] ?? addr;

  const decodeCall = (params: unknown[]): string => {
    const tx = params?.[0] as Record<string, string> | undefined;
    if (!tx) return '';
    const contract = tx.to ? contractName(tx.to) : '';
    const data: string = tx.data ?? tx.input ?? '';
    const selector = data?.slice(0, 10).toLowerCase();
    const fn = selector ? fnName(selector) : '(no data)';
    return `${contract}.${fn}()`;
  };

  const decodeLogs = (params: unknown[]): string => {
    const filter = params?.[0] as Record<string, unknown> | undefined;
    if (!filter) return '';
    const addrs = filter.address
      ? (Array.isArray(filter.address) ? filter.address : [filter.address])
          .map((a: string) => contractName(a))
          .join(', ')
      : '';
    const topics = filter.topics as string[] | undefined;
    const topic0 = topics?.[0];
    const event = topic0
      ? (TOPICS[topic0.toLowerCase()] ?? topic0.slice(0, 10))
      : '';
    return [addrs ? `${addrs}` : '', event ? `::${event}` : '']
      .filter(Boolean)
      .join('');
  };

  return (body: string): string[] => {
    try {
      const parsed = JSON.parse(body);
      const reqs: Record<string, unknown>[] = Array.isArray(parsed)
        ? parsed
        : [parsed];
      if (!reqs[0]?.method) return [];
      return reqs.map((r) => {
        const method = r.method as string;
        const params = r.params as unknown[];
        if (method === 'eth_call') return decodeCall(params);
        if (method === 'eth_getLogs') return `getLogs(${decodeLogs(params)})`;
        if (method === 'eth_getBalance')
          return `getBalance(${(params?.[0] as string) ?? ''})`;
        if (method === 'eth_blockNumber') return 'blockNumber';
        if (method === 'eth_chainId') return 'chainId';
        if (method === 'eth_gasPrice') return 'gasPrice';
        return method;
      });
    } catch {
      return [];
    }
  };
};

// The batch id ties every call of one POST to a single shared duration
const prefix = (id: number, details: string[]) =>
  details.length > 1 ? `#${id}/${details.length}` : `#${id}`;

type RpcLoggerOptions = {
  chainId?: CHAINS;
  /**
   * Diagnostic mode: split every JSON-RPC batch into one request per call, so a
   * hanging call can be named. Costs one HTTP request per call and changes how
   * the RPC provider sees the load — for debugging a stall, not for normal runs.
   */
  unbatch?: boolean;
};

export const attachRpcLogger = (
  page: Page,
  { chainId = CHAINS.Mainnet, unbatch = false }: RpcLoggerOptions = {},
) => {
  const decodeBody = createDecoder(buildContractMap(chainId));
  const pending = new Map<
    object,
    { details: string[]; startMs: number; id: number }
  >();
  const attachedMs = Date.now();
  let seq = 0;

  // Seconds since attach — lets you line up starts with completions
  const at = (ms: number) => `@${((ms - attachedMs) / 1000).toFixed(1)}s`;

  // In unbatch mode the route handler logs each call itself
  const isSplitBatch = (body: string) => {
    if (!unbatch) return false;
    try {
      const parsed = JSON.parse(body);
      return Array.isArray(parsed) && parsed.length > 1 && !!parsed[0]?.method;
    } catch {
      return false;
    }
  };

  page.on('request', (req) => {
    if (req.method() !== 'POST') return;
    const body = req.postData() ?? '';
    if (isSplitBatch(body)) return;
    const details = decodeBody(body);
    if (details.length === 0) return;
    pending.set(req, { details, startMs: Date.now(), id: ++seq });
  });

  page.on('response', (res) => {
    const entry = pending.get(res.request());
    if (!entry) return;
    pending.delete(res.request());
    const ms = Date.now() - entry.startMs;
    const tag = ms > 500 ? `⚠ ${ms}ms` : `${ms}ms`;
    const head = `${prefix(entry.id, entry.details)} ${at(entry.startMs)}`;
    for (const detail of entry.details) {
      console.info(`[RPC ${head}] ${detail}  ${tag}`);
    }
  });

  page.on('requestfailed', (req) => {
    const entry = pending.get(req);
    pending.delete(req);
    const details = entry?.details ?? decodeBody(req.postData() ?? '');
    if (details.length === 0) return;
    const head = entry
      ? `${prefix(entry.id, details)} ${at(entry.startMs)}`
      : '#?';
    const ms = entry ? `${Date.now() - entry.startMs}ms  ` : '';
    for (const detail of details) {
      console.warn(
        `[RPC CANCELLED ${head}] ${detail}  ${ms}${req.failure()?.errorText ?? ''}`,
      );
    }
  });

  page.on('close', () => {
    for (const entry of pending.values()) {
      const head = `${prefix(entry.id, entry.details)} ${at(entry.startMs)}`;
      for (const detail of entry.details) {
        console.warn(
          `[RPC IN FLIGHT ${head}] ${detail}  ${Date.now() - entry.startMs}ms and never answered`,
        );
      }
    }
    pending.clear();
  });

  void page.route('**/*', async (route) => {
    const req = route.request();
    if (!unbatch || req.method() !== 'POST') return route.fallback();

    let calls: Record<string, unknown>[];
    try {
      calls = JSON.parse(req.postData() ?? '');
    } catch {
      return route.fallback();
    }
    if (!Array.isArray(calls) || calls.length < 2 || !calls[0]?.method) {
      return route.fallback();
    }

    const id = ++seq;
    const headers = await req.allHeaders();
    delete headers['content-length'];

    const results = await Promise.all(
      calls.map(async (call, index) => {
        const [detail = String(call.method)] = decodeBody(JSON.stringify(call));
        const head = `#${id}.${index + 1}/${calls.length} ${at(Date.now())}`;
        const startMs = Date.now();
        try {
          const res = await page.request.post(req.url(), {
            headers,
            data: call,
          });
          const ms = Date.now() - startMs;
          const tag = ms > 500 ? `⚠ ${ms}ms` : `${ms}ms`;
          console.info(`[RPC ${head}] ${detail}  ${tag}`);
          return await res.json();
        } catch (error) {
          const ms = Date.now() - startMs;
          console.warn(
            `[RPC FAILED ${head}] ${detail}  ${ms}ms  ${String(error)}`,
          );
          return { jsonrpc: '2.0', id: call.id, error: { code: -32603 } };
        }
      }),
    );

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(results),
    });
  });
};
