import { FC } from 'react';
import { useController } from 'react-hook-form';
import { RadioButton, Stack, Ul } from 'shared/components';
import { SubmitKeysFormInputType } from '../context';
import { Text } from '@lidofinance/lido-ui';
import styled from 'styled-components';
import { StackStyle } from 'shared/components/stack/style';

export const RewardsAddressTypeSelect: FC = () => {
  const {
    field,
    formState: { defaultValues },
  } = useController<SubmitKeysFormInputType, 'extendedManagerPermissions'>({
    name: 'extendedManagerPermissions',
  });

  return (
    <StackWrap>
      <RadioButton
        small
        {...field}
        {...{
          value: false,
          defaultChecked: !defaultValues?.extendedManagerPermissions,
        }}
      >
        <Stack direction="column" gap="sm">
          <Text size="xs" weight={700}>
            Default
          </Text>
          <Text color="secondary" size="xxs">
            By choosing this option you will grant <b>rewards address</b> the
            ultimate control over the Node Operator. Further changes of
            addresses will be two-phased (proposal and confirmation)
          </Text>
          <Ul>
            <li>Rewards address can reset the manager address</li>
            <li>Manager address cannot change the rewards address</li>
          </Ul>
        </Stack>
      </RadioButton>
      <RadioButton
        small
        {...field}
        {...{
          value: true,
          defaultChecked: defaultValues?.extendedManagerPermissions,
        }}
      >
        <Stack direction="column" gap="sm">
          <Text size="xs" weight={700}>
            Extended
          </Text>
          <Text color="secondary" size="xxs">
            By choosing this option you will grant <b>manager address</b> the
            ultimate control over the Node Operator, while rewards&nbsp;address
            is only used to receive rewards.
          </Text>
          <Ul>
            <li>Rewards address cannot reset the manager address</li>
            <li>Manager address can change the rewards address</li>
          </Ul>
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
