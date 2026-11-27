import { Page } from '@playwright/test';
import {
  Address,
  encodeAbiParameters,
  encodeErrorResult,
  Hex,
  isAddress,
  offchainLookupAbiItem,
  pad,
  parseAbiParameters,
  toHex,
} from 'viem';

export const MAINNET_RPC = /\/api\/rpc\?chainId=1$/;
export const CCIP_GATEWAY = 'https://ccip-gateway.e2e.test/';

type RpcMessage = { id: number; params?: [{ to: Address; data?: Hex }] };

// The ENS lookup carries the name DNS-encoded: a length byte, then the label
const encodeLabel = (name: string) => {
  const label = name.split('.')[0];
  return toHex(label.length, { size: 1 }).slice(2) + toHex(label).slice(2);
};

// Replaces the RPC responses `answer` returns a patch for
const routeEnsLookups = async (
  page: Page,
  answer: (call: { to: Address; data: Hex }) => object | undefined,
  rpc: string | RegExp = MAINNET_RPC,
) => {
  await page.route(rpc, async (route) => {
    const body = route.request().postDataJSON();
    const requests: RpcMessage[] = [body].flat();
    const response = await route.fetch();
    const results = [await response.json()].flat().map((res: RpcMessage) => {
      const call = requests.find((r) => r.id === res.id)?.params?.[0];
      const patch = call?.data && answer({ to: call.to, data: call.data });
      return patch
        ? { ...res, result: undefined, error: undefined, ...patch }
        : res;
    });
    await route.fulfill({
      response,
      json: Array.isArray(body) ? results : results[0],
    });
  });

  return () => page.unroute(rpc);
};

/**
 * Answers ENS lookups of `records` on mainnet RPC; everything else goes to the
 * real RPC. Names are matched as typed: `Name.eth` and `name.eth` differ.
 * Returns the cleanup.
 */
export const mockEns = async (page: Page, records: Record<string, Address>) =>
  routeEnsLookups(page, ({ data }) => {
    const address = Object.entries(records).find(([name]) =>
      data.includes(encodeLabel(name)),
    )?.[1];
    if (!address) return;
    return {
      result: encodeAbiParameters(parseAbiParameters('bytes, address'), [
        pad(address),
        address,
      ]),
    };
  });

/**
 * Makes `name` (or the primary name of `address`) an offchain ENS record
 * (EIP-3668): its lookup on `rpc` reverts with OffchainLookup to CCIP_GATEWAY,
 * a fake gateway that fails every request.
 */
export const mockOffchainEns = async (
  page: Page,
  nameOrAddress: string,
  rpc: string | RegExp = MAINNET_RPC,
) => {
  // the reverse lookup carries the address as typed: match any case
  const key = isAddress(nameOrAddress)
    ? nameOrAddress.slice(2).toLowerCase()
    : encodeLabel(nameOrAddress);
  await page.route(`${CCIP_GATEWAY}**`, (route) => route.abort());

  await routeEnsLookups(
    page,
    ({ to, data }) => {
      if (!data.toLowerCase().includes(key)) return;
      return {
        error: {
          code: 3,
          message: 'execution reverted',
          data: encodeErrorResult({
            abi: [offchainLookupAbiItem],
            args: [to, [CCIP_GATEWAY], '0x', '0x00000000', '0x'],
          }),
        },
      };
    },
    rpc,
  );
};
