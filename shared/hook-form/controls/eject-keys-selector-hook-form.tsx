import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { Checkbox } from '@lidofinance/lido-ui';
import { ChangeEventHandler, FC, useCallback, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Latice, Pubkey, Stack, StatusChip } from 'shared/components';
import { StatusStyle } from 'shared/components/status-chip/style';
import styled from 'styled-components';

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
        <CheckboxStyled
          key={pubkey}
          label={
            <Stack center spaceBetween>
              <Pubkey pubkey={pubkey} symbols={16} />

              <Stack direction="column" gap="xs">
                {statuses.map((status) => (
                  <StatusChip status={status} key={status} />
                ))}
              </Stack>
            </Stack>
          }
          disabled={!statuses.includes(KEY_STATUS.EJECTABLE)}
          name={`keys.${index}.checked`}
          checked={selected.includes(index)}
          onChange={onChange}
        />
      ))}
    </Latice>
  );
};

// FIXME: Checkbox render <p> as wrapper of content (usually <div>)
const CheckboxStyled = styled(Checkbox)`
  svg + div {
    width: 100%;
  }

  ${StatusStyle} {
    margin-block: -4px;
  }

  :has(input:disabled) {
    background: var(--lido-color-background);
  }
`;
