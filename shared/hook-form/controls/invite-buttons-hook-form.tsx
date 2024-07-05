import { FC } from 'react';
import { useController } from 'react-hook-form';
import {
  InviteContent,
  RadioButton,
  RadioIcon,
  Stack,
} from 'shared/components';
import { getInviteId } from 'shared/node-operator/utils';
import { NodeOperatorInvite } from 'types';

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
            defaultChecked:
              getInviteId(invite) === getInviteId(defaultValues?.[fieldName]),
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
