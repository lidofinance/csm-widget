import { useBondNextKeysCount } from 'modules/web3';
import { FC, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useAddKeysFormData } from './add-keys-data-provider';
import { AddKeysFormInputType } from './types';

export const AddKeysUpdater: FC = () => {
  const [token, depositData] = useWatch<
    AddKeysFormInputType,
    ['token', 'depositData']
  >({ name: ['token', 'depositData'] });

  const keysCount = depositData?.length ?? 0;

  const { trigger, setValue } = useFormContext<AddKeysFormInputType>();

  const { nodeOperatorId } = useAddKeysFormData();

  const { data: bondAmount } = useBondNextKeysCount({
    nodeOperatorId,
    keysCount,
    token,
  });

  useEffect(() => {
    void trigger('bondAmount');
    // trigger is stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    setValue('bondAmount', bondAmount, { shouldValidate: true });
    // setValue is stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bondAmount]);

  return null;
};
