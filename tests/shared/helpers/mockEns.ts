import { Page } from '@playwright/test';
import {
  Address,
  encodeAbiParameters,
  pad,
  parseAbiParameters,
  toHex,
} from 'viem';

const MAINNET_RPC = /\/api\/rpc\?chainId=1$/;

type RpcMessage = { id: number; params?: [{ data?: string }] };

// The ENS lookup carries the name DNS-encoded: a length byte, then the label
const encodeLabel = (name: string) => {
  const label = name.split('.')[0];
  return toHex(label.length, { size: 1 }).slice(2) + toHex(label).slice(2);
};

/**
 * Answers ENS lookups of `records` on mainnet RPC; everything else goes to the
 * real RPC. Names are matched as typed: `Name.eth` and `name.eth` differ.
 * Returns the cleanup.
 */
export const mockEns = async (page: Page, records: Record<string, Address>) => {
  const findAddress = (data = '') =>
    Object.entries(records).find(([name]) =>
      data.includes(encodeLabel(name)),
    )?.[1];

  await page.route(MAINNET_RPC, async (route) => {
    const body = route.request().postDataJSON();
    const requests: RpcMessage[] = [body].flat();
    const response = await route.fetch();
    const results = [await response.json()].flat().map((res: RpcMessage) => {
      const request = requests.find((r) => r.id === res.id);
      const address = findAddress(request?.params?.[0]?.data);
      if (!address) return res;
      return {
        ...res,
        error: undefined,
        result: encodeAbiParameters(parseAbiParameters('bytes, address'), [
          pad(address),
          address,
        ]),
      };
    });
    await route.fulfill({
      response,
      json: Array.isArray(body) ? results : results[0],
    });
  });

  return () => page.unroute(MAINNET_RPC);
};
