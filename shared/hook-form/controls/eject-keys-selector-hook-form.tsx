import { KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { ChangeEventHandler, FC, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { EjectableKeyCheckbox, Latice } from 'shared/components';

type Props = {
  options: KeyWithStatus[];
  fieldName?: string;
};

export const EjectKeysSelectorHookForm: FC<Props> = ({
  options,
  fieldName = 'selection',
}) => {
  const { setValue, watch, trigger } =
    useFormContext<Record<string, number[]>>();
  const selected = watch(fieldName);

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const name = e.target.name;
      const m = name.match(/keys\.(\d+)\.checked/);
      const i = m?.[1] ? parseInt(m?.[1], 10) : 0;

      const value = Array.from(selected);
      const index = value.indexOf(i);
      if (index >= 0) {
        value.splice(index, 1);
      } else {
        value.push(i);
      }

      setValue(fieldName, value, { shouldValidate: true });
    },
    [fieldName, selected, setValue],
  );

  useEffect(() => {
    void trigger(fieldName);
  }, [fieldName, trigger]);

  return (
    <Latice>
      {options.map(({ pubkey, statuses, index }) => (
        <EjectableKeyCheckbox
          key={pubkey}
          pubkey={pubkey}
          statuses={statuses}
          name={`keys.${index}.checked`}
          checked={selected.includes(index)}
          onChange={onChange}
        />
      ))}
    </Latice>
  );
};
