import { Text } from '@lidofinance/lido-ui';
import { ChangeEvent, FC, useCallback } from 'react';
import { useController } from 'react-hook-form';
import { RadioButton, Stack } from 'shared/components';
import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';
import { SubmitKeysFormInputType } from '../context';

export const RewardsAddressTypeSelect: FC = () => {
  const { field } = useController<
    SubmitKeysFormInputType,
    'extendedManagerPermissions'
  >({
    name: 'extendedManagerPermissions',
  });

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      field.onChange(e.target.value === 'on');
    },
    [field],
  );

  return (
    <StackWrap>
      <RadioButton
        small
        {...field}
        {...{
          value: 'off',
          checked: !field.value,
          onChange,
        }}
      >
        <Stack direction="column" gap="sm">
          <Text size="xs" weight={700}>
            Default
          </Text>
          <Text color="secondary" size="xxs">
            By choosing this option you will grant <b>Rewards Address</b> the
            ultimate control over the Node Operator. Further changes of
            addresses will be two-phased (proposal and confirmation)
          </Text>
          <ul>
            <li>Rewards Address can reset the Manager Address</li>
            <li>Manager Address cannot change the Rewards Address</li>
          </ul>
        </Stack>
      </RadioButton>
      <RadioButton
        small
        {...field}
        {...{
          value: 'on',
          checked: field.value,
          onChange,
        }}
      >
        <Stack direction="column" gap="sm">
          <Text size="xs" weight={700}>
            Extended
          </Text>
          <Text color="secondary" size="xxs">
            By choosing this option you will grant <b>Manager Address</b> the
            ultimate control over the Node Operator, while rewards&nbsp;address
            is only used to receive rewards.
          </Text>
          <ul>
            <li>Rewards Address cannot reset the Manager Address</li>
            <li>Manager Address can change the Rewards Address</li>
          </ul>
        </Stack>
      </RadioButton>
    </StackWrap>
  );
};

const StackWrap = styled(StackStyle).attrs({ $wrap: true })`
  & > * {
    min-width: 240px;
  }
`;
