import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { CheckboxHookForm } from 'shared/hook-form/controls';
import { ConfirmationList } from '../styles';

export const Confirmations: FC = () => {
  return (
    <CheckboxHookForm
      fieldName="confirmed"
      data-testid="confirmCheckbox"
      label={
        <Text size="xxs" color="secondary">
          I confirm that:
          <ConfirmationList>
            <li>
              Cluster participants understand the requirements and eligibility
              criteria
            </li>
            <li>
              Cluster participants agree to enroll in monitoring via DVT
              provider specific tooling (e.g. Obol Grafana metrics or automatic
              SSV Network metrics)
            </li>
          </ConfirmationList>
        </Text>
      }
    />
  );
};
