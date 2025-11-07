import { useQueryClient } from '@tanstack/react-query';
import { ICS_FORM_STATUS_KEY } from 'features/ics/shared';
import { useDappStatus } from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import type { ApplyFormNetworkData } from './types';

const useApplyFormNetworkData: NetworkData<ApplyFormNetworkData> = () => {
  const { address } = useDappStatus();

  const queryClient = useQueryClient();

  const revalidate = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: [ICS_FORM_STATUS_KEY],
    });
  }, [queryClient]);

  return {
    data: {
      mainAddress: address,
    } as ApplyFormNetworkData,
    isPending: false,
    revalidate,
  };
};

export const useApplyFormData = useFormData<ApplyFormNetworkData>;

export const ApplyDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useApplyFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
