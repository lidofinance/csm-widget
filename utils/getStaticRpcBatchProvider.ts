import { JsonRpcProvider, Network } from '@ethersproject/providers';
import { CHAINS } from 'consts';
import {
  deepCopy,
  defineReadOnly,
  fetchJson,
  Logger,
} from 'ethers/lib/utils.js';

const MAX_BATCH_SIZE = 20;

const createProviderGetter = <P extends typeof JsonRpcProvider>(
  Provider: P,
) => {
  const cache = new Map<string, InstanceType<P>>();

  return (
    chainId: CHAINS,
    url: string,
    cacheSeed = 0,
    pollingInterval: number | null = null,
  ): InstanceType<P> => {
    const cacheKey = `${chainId}-${cacheSeed}-${url}`;
    let provider = cache.get(cacheKey);

    if (!provider) {
      provider = new Provider(url, chainId) as InstanceType<P>;
      cache.set(cacheKey, provider);
    }

    if (pollingInterval) {
      provider.pollingInterval = pollingInterval;
    }

    return provider;
  };
};

const logger = new Logger('StaticJsonRpcBatchProvider/1.0');

export class StaticJsonRpcBatchProvider extends JsonRpcProvider {
  async detectNetwork(): Promise<Network> {
    let network = this.network;

    if (network == null) {
      network = await super.detectNetwork();

      if (!network) {
        logger.throwError(
          'no network detected',
          Logger.errors.UNKNOWN_ERROR,
          {},
        );
      }

      // If still not set, set it
      if (this._network == null) {
        // A static network does not support "any"
        defineReadOnly(this, '_network', network);

        this.emit('network', network, null);
      }
    }

    return network;
  }

  _pendingBatchAggregator: NodeJS.Timer | null = null;
  _pendingBatch: Array<{
    request: { method: string; params: Array<any>; id: number; jsonrpc: '2.0' };
    resolve: (result: any) => void;
    reject: (error: Error) => void;
  }> = [];

  send(method: string, params: Array<any>): Promise<any> {
    const request = {
      method: method,
      params: params,
      id: this._nextId++,
      jsonrpc: '2.0',
    };

    const inflightRequest: any = { request, resolve: null, reject: null };

    const promise = new Promise((resolve, reject) => {
      inflightRequest.resolve = resolve;
      inflightRequest.reject = reject;
    });

    this._pendingBatch.push(inflightRequest);

    // eslint-disable-next-line unicorn/consistent-function-scoping
    const runAggregator = () => {
      if (this._pendingBatchAggregator) {
        return;
      }
      // Schedule batch for next event loop + short duration
      this._pendingBatchAggregator = setTimeout(() => {
        // Get teh current batch and clear it, so new requests
        // go into the next batch
        const batch = this._pendingBatch.splice(0, MAX_BATCH_SIZE);
        this._pendingBatchAggregator = null;
        if (batch.length === 0) {
          return;
        }
        if (this._pendingBatch.length > 0) {
          runAggregator();
        }

        // Get the request as an array of requests
        const request = batch.map((inflight) => inflight.request);

        this.emit('debug', {
          action: 'requestBatch',
          request: deepCopy(request),
          provider: this,
        });

        return fetchJson(this.connection, JSON.stringify(request)).then(
          (result) => {
            this.emit('debug', {
              action: 'response',
              request: request,
              response: result,
              provider: this,
            });

            // For each result, feed it to the correct Promise, depending
            // on whether it was a success or error
            batch.forEach((inflightRequest, index) => {
              const payload = result[index];
              if (payload.error) {
                const error = new Error(payload.error.message);
                (<any>error).code = payload.error.code;
                (<any>error).data = payload.error.data;
                inflightRequest.reject(error);
              } else {
                inflightRequest.resolve(payload.result);
              }
            });
          },
          (error) => {
            this.emit('debug', {
              action: 'response',
              error: error,
              request: request,
              provider: this,
            });

            batch.forEach((inflightRequest) => {
              inflightRequest.reject(error);
            });
          },
        );
      }, 10);
    };

    runAggregator();

    return promise;
  }
}

export const getStaticRpcBatchProvider = createProviderGetter(
  StaticJsonRpcBatchProvider,
);
