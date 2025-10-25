import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { ChangeEventHandler, FC } from 'react';
import { IconTooltip, Pubkey, Stack, StatusChip } from 'shared/components';
import { Hex } from 'viem';
import { CheckboxStyled, StatusesWrapper } from './styles';

type EjectableKeyCheckboxProps = {
  pubkey: Hex;
  statuses: KEY_STATUS[];
  name: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const EjectableKeyCheckbox: FC<EjectableKeyCheckboxProps> = ({
  statuses,
  pubkey,
  ...props
}) => {
  const disabled = !statuses.includes(KEY_STATUS.EJECTABLE);

  return (
    <CheckboxStyled
      {...props}
      label={
        <Stack center spaceBetween>
          <Pubkey pubkey={pubkey} symbols={14} />

          <Stack center gap="sm">
            <StatusesWrapper>
              {statuses.map((status) => (
                <StatusChip status={status} key={status} />
              ))}
            </StatusesWrapper>
            {disabled && (
              <IconTooltip
                placement="left"
                tooltip="Only keys that have been active for at least 256 epochs (~27 hours) can be exited"
              />
            )}
          </Stack>
        </Stack>
      }
      disabled={disabled}
    />
  );
};
