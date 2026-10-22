import {
  KEY_TOP_UP_ALLOCATION,
  useNodeOperatorId,
  useTopUpAllocationEnabled,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import { FormDataContext, useFormData } from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import type { TopUpAllocationFormNetworkData } from './types';

const useTopUpAllocationFormNetworkData = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: enabled, isPending } = useTopUpAllocationEnabled({
    nodeOperatorId,
  });
  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([KEY_TOP_UP_ALLOCATION]);
  }, [invalidate]);

  return {
    data: {
      nodeOperatorId,
      enabled,
    } as TopUpAllocationFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useTopUpAllocationFormData =
  useFormData<TopUpAllocationFormNetworkData>;

export const TopUpAllocationDataProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const networkData = useTopUpAllocationFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
