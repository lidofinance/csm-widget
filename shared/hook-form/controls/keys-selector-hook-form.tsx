import { Address, Checkbox } from '@lidofinance/lido-ui';
import { ChangeEventHandler, FC, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Latice, Stack } from 'shared/components';

type Props = {
  options: string[];
  fieldName?: string;
};

export const KeysSelectorHookForm: FC<Props> = ({
  options,
  fieldName = 'selection',
}) => {
  const { setValue, watch, trigger } =
    useFormContext<Record<string, { start: number; count: number }>>();
  const { start, count } = watch(fieldName);

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const name = e.target.name;
      const m = name.match(/keys\.(\d+)\.checked/);
      const i = m?.[1] ? parseInt(m?.[1], 10) : 0;

      let newStart = start;
      let newCount = count;

      if (count === 0) {
        newStart = i;
        newCount = 1;
      } else if (i < start) {
        newStart = i;
        newCount = start + count - i;
      } else if (i >= start && i !== start + count - 1) {
        newCount = i - start + 1;
      } else if (i >= start && i === start + count - 1) {
        newCount = i - start;
      }

      setValue(
        fieldName,
        { start: newStart, count: newCount },
        { shouldValidate: true },
      );
    },
    [count, fieldName, setValue, start],
  );

  useEffect(() => {
    void trigger(fieldName);
  }, [fieldName, trigger]);

  // TODO: key status
  return (
    <Latice>
      {options.map((key, index) => (
        <Stack key={key}>
          <Checkbox
            label={<Address as="span" address={key} symbols={20} />}
            name={`keys.${index}.checked`}
            checked={index >= start && index < start + count}
            onChange={onChange}
          />
        </Stack>
      ))}
    </Latice>
  );
};
