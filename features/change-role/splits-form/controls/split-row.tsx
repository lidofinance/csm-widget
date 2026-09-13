import { ButtonIcon, Close, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import {
  AddressInputHookForm,
  PercentInputHookForm,
} from 'shared/hook-form/controls';
import { SplitsFormInputType } from '../context/types';
import { AddressColumn, RowStyle, ShareColumn } from './styles';

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
    <div>
      <RowStyle>
        <AddressColumn>
          <AddressInputHookForm
            fieldName={`feeSplits.${index}.recipient`}
            label={`Additional address #${index + 1}`}
            error={!!recipientError}
            simple
          />
        </AddressColumn>
        <ShareColumn>
          <PercentInputHookForm
            fieldName={`feeSplits.${index}.share`}
            label="Share, %"
            placeholder="0.00"
            onChange={() => {
              clearErrors(`feeSplits.${index}.share`);
            }}
            error={!!shareError}
          />
        </ShareColumn>
        <ButtonIcon
          icon={<Close />}
          variant="ghost"
          color="secondary"
          size="xs"
          onClick={() => onRemove(index)}
          aria-label="Remove"
        />
      </RowStyle>
      {errorMessage && (
        <Text size="xxs" color="error">
          {errorMessage}
        </Text>
      )}
    </div>
  );
};
