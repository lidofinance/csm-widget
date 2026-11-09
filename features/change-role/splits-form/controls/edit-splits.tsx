import {
  Button,
  IconPlus,
  SectionTitle,
  Stack,
  Typography,
} from '@lidofinance/lido-app-ui';
import { MAX_FEE_SPLITS_COUNT } from '@lidofinance/lido-csm-sdk';
import { FC, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FormCard } from 'shared/form-page';
import { FieldError } from 'shared/hook-form/fields';
import { SplitsFormInputType } from '../context';
import { BondRow } from './bond-row';
import { EditInfo } from './edit-info';
import { SplitRow } from './split-row';
import { SplitsCtas } from './submit-button';

export const EditSplits: FC = () => {
  const { control, formState } = useFormContext<SplitsFormInputType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'feeSplits',
  });

  const handleAdd = useCallback(() => {
    append({ recipient: undefined, share: undefined });
  }, [append]);

  const splitsError = formState.errors.feeSplits;
  const rootError =
    splitsError && 'root' in splitsError
      ? splitsError.root
      : splitsError && 'message' in splitsError
        ? splitsError
        : undefined;

  return (
    <>
      <EditInfo />
      <FormCard>
        <Stack gap={12}>
          <BondRow />
          <Typography color="secondary" variant="description" as="p">
            This share decreases as you allocate shares to the addresses below
          </Typography>
        </Stack>

        <Stack gap={12}>
          <SectionTitle
            title="Additional addresses"
            action={
              fields.length < MAX_FEE_SPLITS_COUNT ? (
                <Button
                  variant="outline"
                  size="small"
                  iconLeft={<IconPlus />}
                  onClick={handleAdd}
                  data-testid="addSplitButton"
                >
                  Add new address
                </Button>
              ) : undefined
            }
          />
          {fields.map((field, index) => (
            <SplitRow key={field.id} index={index} onRemove={remove} />
          ))}
          <FieldError>{rootError?.message}</FieldError>
        </Stack>

        <SplitsCtas />
      </FormCard>
    </>
  );
};
