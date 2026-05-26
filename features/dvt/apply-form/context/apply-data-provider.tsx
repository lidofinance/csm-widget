import { useQueryClient } from '@tanstack/react-query';
import { surveysKeys } from 'modules/surveys-sdk';
import { useDappStatus } from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import type { DvtApplyFormNetworkData } from './types';

const useApplyFormNetworkData: NetworkData<DvtApplyFormNetworkData> = () => {
  const { address } = useDappStatus();

  const queryClient = useQueryClient();

  const revalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: surveysKeys.auth });
  }, [queryClient]);

  return {
    data: {
      mainAddress: address,
    } as DvtApplyFormNetworkData,
    isPending: false,
    revalidate,
  };
};

export const useApplyFormData = useFormData<DvtApplyFormNetworkData>;

export const ApplyDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useApplyFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
