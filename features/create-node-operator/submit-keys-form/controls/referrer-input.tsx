import { REF_MAPPING } from 'consts/ref-mapping';
import { FC, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { AddressInputHookForm } from 'shared/hook-form/controls';
import { compareLowercase } from 'utils';
import { SubmitKeysFormInputType } from '../context';

export const ReferrerInput: FC = () => {
  const referrer = useWatch<SubmitKeysFormInputType, 'referrer'>({
    name: 'referrer',
  });

  const refName = useMemo(
    () =>
      REF_MAPPING.find(({ address }) => compareLowercase(address, referrer))
        ?.name,
    [referrer],
  );

  return (
    <AddressInputHookForm
      fieldName="referrer"
      label="Referrer address"
      addressName={refName}
      disabled
    />
  );
};
