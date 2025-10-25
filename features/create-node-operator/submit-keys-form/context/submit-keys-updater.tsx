import { useBondByKeysCount } from 'modules/web3';
import { FC, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useSubmitKeysFormData } from './submit-keys-data-provider';
import { SubmitKeysFormInputType } from './types';

export const SubmitKeysUpdater: FC = () => {
  const [token, depositData] = useWatch<
    SubmitKeysFormInputType,
    ['token', 'depositData']
  >({ name: ['token', 'depositData'] });

  const keysCount = depositData?.length ?? 0;

  const { trigger, setValue } = useFormContext<SubmitKeysFormInputType>();

  const { curveId } = useSubmitKeysFormData();

  const { data: bondAmount } = useBondByKeysCount({
    keysCount,
    token,
    curveId,
  });

  useEffect(() => {
    void trigger('bondAmount');
    // trigger are stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    setValue('bondAmount', bondAmount, { shouldValidate: true });
    // setValue are stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bondAmount]);

  return null;
};
