import { MAX_FEE_SPLITS_COUNT } from '@lidofinance/lido-csm-sdk';
import { ButtonIcon, Plus, Text } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Stack } from 'shared/components';
import { SplitsFormInputType } from '../context';
import { SplitRow } from './split-row';
import styled from 'styled-components';

export const EditSplits: FC = () => {
  const { control } = useFormContext<SplitsFormInputType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'feeSplits',
  });

  const handleAdd = useCallback(() => {
    if (fields.length < MAX_FEE_SPLITS_COUNT) {
      append({ recipient: undefined, share: 0n });
    }
  }, [append, fields.length]);

  const { formState } = useFormContext<SplitsFormInputType>();
  const splitsError = formState.errors.feeSplits;
  const rootError =
    splitsError && 'root' in splitsError
      ? splitsError.root
      : splitsError && 'message' in splitsError
        ? splitsError
        : undefined;

  return (
    <Stack direction="column" gap="sm">
      <Text size="xs" weight={700}>
        Additional addresses
      </Text>

      {fields.map((field, index) => (
        <SplitRow
          key={field.id}
          // field={field}
          index={index}
          onRemove={remove}
        />
      ))}

      {rootError?.message && (
        <Text size="xxs" color="error">
          {rootError.message}
        </Text>
      )}

      {fields.length < MAX_FEE_SPLITS_COUNT && (
        <ButtonStyled
          icon={<Plus />}
          variant="text"
          size="xs"
          onClick={handleAdd}
        >
          Add new address
        </ButtonStyled>
      )}
    </Stack>
  );
};

const ButtonStyled = styled(ButtonIcon)`
  width: fit-content;
`;
