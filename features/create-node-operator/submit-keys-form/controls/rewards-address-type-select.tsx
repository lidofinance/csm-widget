import { RadioButton } from '@lidofinance/lido-app-ui';
import { ChangeEvent, FC, ReactNode, useCallback } from 'react';
import { useController } from 'react-hook-form';
import { SubmitKeysFormInputType } from '../context';
import {
  PermissionLabelStyle,
  PermissionsStyle,
  PermissionTextStyle,
  PermissionTitleStyle,
} from './styles';

type PermissionLabelProps = {
  title: string;
  description: ReactNode;
  rules: [string, string];
};

const PermissionLabel: FC<PermissionLabelProps> = ({
  title,
  description,
  rules,
}) => (
  <PermissionLabelStyle>
    <PermissionTitleStyle>{title}</PermissionTitleStyle>
    <PermissionTextStyle>{description}</PermissionTextStyle>
    {rules.map((rule) => (
      <PermissionTextStyle key={rule}>{rule}</PermissionTextStyle>
    ))}
  </PermissionLabelStyle>
);

export const RewardsAddressTypeSelect: FC = () => {
  const { field } = useController<
    SubmitKeysFormInputType,
    'extendedManagerPermissions'
  >({ name: 'extendedManagerPermissions' });
  const { onChange: setExtended } = field;

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setExtended(e.target.value === 'on'),
    [setExtended],
  );

  return (
    <PermissionsStyle
      role="radiogroup"
      aria-label="Manager Address permissions type"
    >
      <RadioButton
        ref={field.ref}
        name={field.name}
        value="off"
        checked={!field.value}
        onChange={onChange}
        onBlur={field.onBlur}
        label={
          <PermissionLabel
            title="Default"
            description={
              <>
                By choosing this option you will grant <b>Rewards Address</b>{' '}
                the ultimate control over the Node Operator. Further changes of
                addresses will be two-phased (proposal and confirmation).
              </>
            }
            rules={[
              'Rewards Address can reset the Manager Address',
              'Manager Address cannot change the Rewards Address',
            ]}
          />
        }
      />
      <RadioButton
        name={field.name}
        value="on"
        checked={field.value}
        onChange={onChange}
        onBlur={field.onBlur}
        label={
          <PermissionLabel
            title="Extended"
            description={
              <>
                By choosing this option you will grant <b>Manager Address</b>{' '}
                the ultimate control over the Node Operator, while
                rewards&nbsp;address is only used to receive rewards
              </>
            }
            rules={[
              'Rewards Address cannot reset the Manager Address',
              'Manager Address can change the Rewards Address',
            ]}
          />
        }
      />
    </PermissionsStyle>
  );
};
