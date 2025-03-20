import { JsonRpcBatchProvider } from '@ethersproject/providers';
import { Network } from '@ethersproject/networks';
export declare class StaticJsonRpcBatchProvider extends JsonRpcBatchProvider {
    detectNetwork(): Promise<Network>;
}
