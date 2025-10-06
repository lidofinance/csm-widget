import { Text } from '@lidofinance/lido-ui';
import { useLidoSDK } from 'modules/web3';
import { FC, useCallback } from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { Pubkey } from 'shared/components';
import {
  DataCell,
  DataError,
  DeleteButton,
  HeaderCell,
  TableContainer,
  TableHeader,
  TableRow,
} from './styles';
import { DepositDataInputType } from './use-parse-deposit-data';

export const DepositDataParsed: FC = () => {
  const { csm } = useLidoSDK();
  const {
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<DepositDataInputType>();

  const { isValidating, isSubmitting } = useFormState();

  const depositDataErrors = errors.depositData?.types;

  const [depositData, rawDepositData] = useWatch<
    DepositDataInputType,
    ['depositData', 'rawDepositData']
  >({
    name: ['depositData', 'rawDepositData'],
  });

  const remove = useCallback(
    (index: number) => {
      const result = csm.depositData.removeKey(rawDepositData ?? '', index);

      if (result.success && result.json !== undefined) {
        clearErrors('rawDepositData');
        clearErrors('depositData');
        setValue('rawDepositData', result.json, {
          shouldValidate: true,
        });
      } else {
        setError('rawDepositData', {
          type: 'REMOVE_KEY_ERROR',
          message: result.error || 'Failed to remove key',
        });
      }
    },
    [csm.depositData, rawDepositData, setValue, setError, clearErrors],
  );

  return (
    <TableContainer>
      <TableHeader>
        <HeaderCell>Recognized Pubkey</HeaderCell>
        <HeaderCell>Key number</HeaderCell>
        <HeaderCell>Errors detected</HeaderCell>
        <HeaderCell>Delete key</HeaderCell>
      </TableHeader>

      {depositData.map(({ pubkey }, index) => {
        const errors = depositDataErrors?.[index] as string[] | undefined;
        const hasError = !!errors?.length;

        return (
          <TableRow key={pubkey}>
            <DataCell $error={hasError}>
              <Pubkey pubkey={pubkey} color={hasError ? 'error' : 'default'} />
            </DataCell>
            <DataCell $error={hasError}>#{index + 1}</DataCell>
            <DataCell $error={hasError}>{hasError ? 'Yes' : 'No'}</DataCell>
            <DataCell>
              <DeleteButton
                onClick={() => remove(index)}
                disabled={isValidating || isSubmitting}
              />
            </DataCell>
            {hasError && (
              <DataError>
                {errors?.map((error) => (
                  <Text key={error} color="secondary" size="xxs">
                    {error}
                  </Text>
                ))}
              </DataError>
            )}
          </TableRow>
        );
      })}
    </TableContainer>
  );
};
