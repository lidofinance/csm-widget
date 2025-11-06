import { FC, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { AddBondFormInputType } from './types';

export const AddBondUpdater: FC = () => {
  const [token] = useWatch<AddBondFormInputType, ['token']>({
    name: ['token'],
  });

  const { trigger } = useFormContext<AddBondFormInputType>();

  useEffect(() => {
    void trigger('bondAmount');
    // trigger is stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return null;
};
