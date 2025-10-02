import { NodeOperatorInvite } from '@lidofinance/lido-csm-sdk';
import { FC, useMemo } from 'react';
import { useController } from 'react-hook-form';
import {
  InviteContent,
  RadioButton,
  RadioIcon,
  Stack,
} from 'shared/components';
import { getInviteId } from 'shared/node-operator/utils';

type Props = {
  fieldName?: string;
  options: NodeOperatorInvite[];
};

export const InviteButtonsHookForm: FC<Props> = ({
  fieldName = 'invite',
  options,
}) => {
  const {
    field,
    formState: { defaultValues },
  } = useController<Record<string, NodeOperatorInvite>>({ name: fieldName });
  const defaultInvite = useMemo(() => {
    const value = defaultValues?.[fieldName];
    return value?.id && value.role
      ? getInviteId({ id: value.id, role: value.role })
      : undefined;
  }, [defaultValues, fieldName]);

  return (
    <Stack direction="column">
      {options.map((invite) => (
        <RadioButton
          key={getInviteId(invite)}
          {...field}
          {...{
            value: getInviteId(invite),
            onChange: (e: any) =>
              field.onChange(
                options.find((i) => getInviteId(i) === e.target.value),
              ),
            defaultChecked: getInviteId(invite) === defaultInvite,
          }}
        >
          <Stack>
            <RadioIcon />
            <InviteContent invite={invite} />
          </Stack>
        </RadioButton>
      ))}
    </Stack>
  );
};
