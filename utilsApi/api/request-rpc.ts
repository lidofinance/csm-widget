import { iterateUrls } from '@lidofinance/rpc';
import type { FetchRpcInitBody } from '@lidofinance/rpc';
import type { RPCFactoryParams } from './types';

// Provider URLs carry API keys in userinfo, path or query
export const redactUrls = (text: string) =>
  text.replace(/[a-z][a-z0-9+.-]*:\/\/[^\s'"]+/gi, '<url>');

export const requestRpcFactory =
  ({ providers, fetchRPC }: Pick<RPCFactoryParams, 'providers' | 'fetchRPC'>) =>
  async (chainId: number, body: FetchRpcInitBody): Promise<Response> => {
    const received: Response[] = [];
    let result: Response | undefined;
    try {
      result = await iterateUrls(
        providers[chainId],
        async (url) => {
          const response = await fetchRPC(url, { body }, { chainId });
          received.push(response);
          return response;
        },
        (error, { attempt }) => {
          const message =
            error instanceof Error ? error.message : String(error);
          console.error(
            `[rpcFactory] ${redactUrls(message)} (attempt ${attempt})`,
          );
        },
      );
      return result;
    } finally {
      for (const response of received) {
        if (response !== result) {
          void response.body?.cancel().catch(() => undefined);
        }
      }
    }
  };
