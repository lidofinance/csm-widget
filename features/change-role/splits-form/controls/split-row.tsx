import { IconButton, IconCross } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import {
  AddressField,
  FieldError,
  PercentField,
} from 'shared/hook-form/fields';
import { SplitsFormInputType } from '../context/types';
import {
  EditShareRowStyle,
  RemoveButtonCellStyle,
  SectionStyle,
} from '../styles';

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
    <SectionStyle>
      <EditShareRowStyle>
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
        <RemoveButtonCellStyle>
          <IconButton
            variant="ghost"
            icon={<IconCross />}
            aria-label="Remove"
            onClick={() => onRemove(index)}
          />
        </RemoveButtonCellStyle>
      </EditShareRowStyle>
      <FieldError>{errorMessage}</FieldError>
    </SectionStyle>
  );
};
