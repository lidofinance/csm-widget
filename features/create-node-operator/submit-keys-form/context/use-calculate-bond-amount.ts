import { UseFormReturn } from 'react-hook-form';
import { useNodeOperatorFirstKeysBond } from 'shared/hooks';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';

export const useCalculateBondAmount = (
  { watch }: UseFormReturn<SubmitKeysFormInputType>,
  { curveId }: SubmitKeysFormNetworkData,
) => {
  const [token, depositData] = watch(['token', 'depositData']);

  const { data, loading } = useNodeOperatorFirstKeysBond({
    keysCount: depositData.length,
    token,
    curveId,
  });

  return loading ? undefined : data;
};
