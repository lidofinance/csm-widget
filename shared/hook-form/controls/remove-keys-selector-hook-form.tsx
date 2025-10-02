import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { ChangeEventHandler, FC, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  CheckboxStyled,
  Latice,
  Pubkey,
  Stack,
  StatusChip,
} from 'shared/components';

type Props = {
  options: KeyWithStatus[];
  fieldName?: string;
};

const BAD_STATUSES: KEY_STATUS[] = [
  KEY_STATUS.UNBONDED,
  KEY_STATUS.DUPLICATED,
  KEY_STATUS.INVALID,
  KEY_STATUS.NON_QUEUED,
  KEY_STATUS.UNCHECKED,
];

export const RemoveKeysSelectorHookForm: FC<Props> = ({
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

  return (
    <Latice>
      {options.map(
        (
          { pubkey, statuses },
          index, // FIXME: index of key
        ) => (
          <CheckboxStyled
            key={pubkey}
            label={
              <Stack center spaceBetween>
                <Pubkey pubkey={pubkey} symbols={16} />

                {statuses
                  .filter((status) => BAD_STATUSES.includes(status))
                  .map((status) => (
                    <StatusChip status={status} key={status} />
                  ))}
              </Stack>
            }
            name={`keys.${index}.checked`}
            checked={index >= start && index < start + count}
            onChange={onChange}
          />
        ),
      )}
    </Latice>
  );
};
