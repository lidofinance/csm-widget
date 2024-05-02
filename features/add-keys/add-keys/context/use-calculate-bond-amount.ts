import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useNodeOperatorNextKeysBond } from 'shared/hooks';
import { AddKeysFormInputType } from './types';

export const useCalculateBondAmount = ({
  watch,
  setValue,
}: UseFormReturn<AddKeysFormInputType>) => {
  const nodeOperatorId = useNodeOperatorId();
  const [token, depositData] = watch(['token', 'depositData']);

  const { data, loading } = useNodeOperatorNextKeysBond({
    nodeOperatorId,
    keysCount: depositData.length,
    token,
  });

  useEffect(() => {
    setValue('bondAmount', loading ? undefined : data);
  }, [data, loading, setValue]);
};
