import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { KEY_TOP_UP_ALLOCATION, useOperatorsCount } from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { type EnableTopUpAllocationFormNetworkData } from './types';

const useEnableTopUpAllocationFormNetworkData: NetworkData<
  EnableTopUpAllocationFormNetworkData
> = () => {
  const { data: nodeOperatorsCount, isPending } = useOperatorsCount(
    MODULE_NAME.CM,
  );

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([KEY_TOP_UP_ALLOCATION]);
  }, [invalidate]);

  return {
    data: { nodeOperatorsCount } as EnableTopUpAllocationFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useEnableTopUpAllocationFormData =
  useFormData<EnableTopUpAllocationFormNetworkData>;

export const EnableTopUpAllocationDataProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const networkData = useEnableTopUpAllocationFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
