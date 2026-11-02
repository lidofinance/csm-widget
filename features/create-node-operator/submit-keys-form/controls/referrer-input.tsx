import { REF_MAPPING } from 'consts/ref-mapping';
import { FC, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { AddressField } from 'shared/hook-form/fields';
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

  if (!referrer) return null;

  return (
    <AddressField
      name="referrer"
      label="Referrer address"
      addressName={refName}
      disabled
    />
  );
};
