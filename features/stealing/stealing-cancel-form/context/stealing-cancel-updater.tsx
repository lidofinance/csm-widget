import { useOperatorBalance } from 'modules/web3';
import { FC, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { StealingCancelFormInputType } from './types';

export const StealingCancelUpdater: FC = () => {
  const [nodeOperatorId] = useWatch<
    StealingCancelFormInputType,
    ['nodeOperatorId']
  >({ name: ['nodeOperatorId'] });

  const { trigger, setValue } = useFormContext<StealingCancelFormInputType>();

  const { data: maxAmount } = useOperatorBalance(
    nodeOperatorId,
    (data) => data.locked,
  );

  useEffect(() => {
    void trigger('maxAmount');
    // trigger is stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeOperatorId]);

  useEffect(() => {
    setValue('maxAmount', maxAmount, { shouldValidate: true });
    // setValue is stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxAmount]);

  return null;
};
