import { Grid, IconButton, IconCross, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import {
  AddressField,
  FieldError,
  PercentField,
} from 'shared/hook-form/fields';
import { SplitsFormInputType } from '../context/types';

const COLUMNS = {
  base: 'minmax(0, 1fr) 120px 40px',
  xsDown: 'minmax(0, 1fr) 96px 40px',
};

const REMOVE_CELL_STYLE = { height: 48 };

type SplitRowProps = {
  index: number;
  onRemove: (index: number) => void;
};

export const SplitRow: FC<SplitRowProps> = ({ index, onRemove }) => {
  const { errors } = useFormState<SplitsFormInputType & Record<string, string>>(
    {
      name: [
        `feeSplits.${index}.recipient`,
        `feeSplits.${index}.share`,
        `totalShare`,
      ],
    },
  );

  const { clearErrors } = useFormContext<SplitsFormInputType>();

  const recipientError =
    errors.feeSplits?.[index]?.recipient ??
    errors[`feeSplits.${index}.recipient`];
  const shareError =
    errors.feeSplits?.[index]?.share ??
    errors[`feeSplits.${index}.share`] ??
    errors.totalShare;
  const errorMessage = recipientError?.message || shareError?.message;

  return (
    <Stack gap={12}>
      <Grid columns={COLUMNS} gap={12} align="end">
        <AddressField
          name={`feeSplits.${index}.recipient`}
          label={`Additional address #${index + 1}`}
          simple
          error={!!recipientError}
        />
        <PercentField
          name={`feeSplits.${index}.share`}
          label="Share, %"
          error={!!shareError}
          onChange={() => clearErrors(`feeSplits.${index}.share`)}
        />
        <Stack align="center" justify="center" style={REMOVE_CELL_STYLE}>
          <IconButton
            variant="ghost"
            icon={<IconCross />}
            aria-label="Remove"
            onClick={() => onRemove(index)}
          />
        </Stack>
      </Grid>
      <FieldError>{errorMessage}</FieldError>
    </Stack>
  );
};
