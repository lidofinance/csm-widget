import { FC, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useEjectKeysFormData } from './eject-keys-data-provider';
import { EjectKeysFormInputType } from './types';

export const EjectKeysUpdater: FC = () => {
  const [selection] = useWatch<EjectKeysFormInputType, ['selection']>({
    name: ['selection'],
  });

  const { setValue } = useFormContext<EjectKeysFormInputType>();

  const { ejectKeyFee } = useEjectKeysFormData();

  const feeAmount =
    ejectKeyFee !== undefined && selection?.length
      ? ejectKeyFee * BigInt(selection.length)
      : undefined;

  useEffect(() => {
    setValue('feeAmount', feeAmount, { shouldValidate: true });
    // setValue is stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeAmount]);

  return null;
};
