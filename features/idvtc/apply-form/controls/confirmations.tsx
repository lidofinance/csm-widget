import { Body, CheckboxRow, Description } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { FIELD_ERROR_TEST_ID } from 'shared/hook-form/fields';
import { useFieldController } from 'shared/hook-form/fields/use-field-controller';
import { ConfirmationList } from '../../shared';

export const Confirmations: FC = () => {
  const { field, invalid, message } = useFieldController({
    name: 'confirmed',
  });

  return (
    <div data-testid="confirmationsSection">
      <CheckboxRow
        ref={field.ref}
        name={field.name}
        checked={!!field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        disabled={field.disabled}
        error={message || invalid}
        label={<Body>I confirm that:</Body>}
        description={
          <Description as="div" color="secondary">
            <ConfirmationList>
              <li>
                Cluster participants understand the requirements and eligibility
                criteria
              </li>
              <li>
                Cluster participants agree to enroll in monitoring via DVT
                provider specific tooling (e.g. Obol Grafana metrics or
                automatic SSV Network metrics)
              </li>
            </ConfirmationList>
          </Description>
        }
        dataTestId={{ input: 'confirmCheckbox', error: FIELD_ERROR_TEST_ID }}
      />
    </div>
  );
};
