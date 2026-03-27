import { ButtonIcon, Close, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { Stack } from 'shared/components';
import {
  AddressInputHookForm,
  PercentInputHookForm,
} from 'shared/hook-form/controls';
import styled from 'styled-components';
import { SplitsFormInputType } from '../context/types';

const AddressColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

const ShareColumn = styled.div`
  width: 90px;
  flex-shrink: 0;
`;

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
      <Stack gap="sm" center>
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
      </Stack>
      {errorMessage && (
        <Text size="xxs" color="error">
          {errorMessage}
        </Text>
      )}
    </div>
  );
};
