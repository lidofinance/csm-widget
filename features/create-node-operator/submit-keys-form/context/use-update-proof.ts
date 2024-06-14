import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';

export const useUpdateProof = (
  { setValue }: UseFormReturn<SubmitKeysFormInputType>,
  { eaProof, loading }: SubmitKeysFormNetworkData,
) => {
  useEffect(() => {
    setValue(
      'eaProof',
      loading.isEaProofLoading || !eaProof ? undefined : eaProof,
    );
  }, [eaProof, loading.isEaProofLoading, setValue]);
};
