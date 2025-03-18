import { useContext } from 'react';
import invariant from 'tiny-invariant';
import { SDKContext } from '../context/SDK.js';

const useSDK = () => {
    const contextValue = useContext(SDKContext);
    invariant(contextValue, 'useSDK was used outside of SDKContext');
    return contextValue;
};

export { useSDK };
