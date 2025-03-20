import { CHAINS } from '@lido-sdk/constants';
import { BaseProvider, Web3Provider } from '@ethersproject/providers';
import { FC } from 'react';
import { SWRConfiguration } from 'swr';
export interface SDKContextProps {
    chainId: CHAINS;
    supportedChainIds: CHAINS[];
    providerMainnetRpc?: BaseProvider;
    providerRpc?: BaseProvider;
    providerWeb3?: Web3Provider;
    swrConfig?: SWRConfiguration;
    account?: string;
    onError?: (error: unknown) => void;
}
export interface SDKContextValue {
    chainId: CHAINS;
    supportedChainIds: CHAINS[];
    providerMainnetRpc: BaseProvider;
    providerRpc: BaseProvider;
    providerWeb3?: Web3Provider;
    swrConfig?: SWRConfiguration;
    account?: string;
    onError: (error: unknown) => void;
}
export declare const SDKContext: import("react").Context<SDKContextValue | null>;
declare const _default: import("react").MemoExoticComponent<FC<SDKContextProps>>;
export default _default;
