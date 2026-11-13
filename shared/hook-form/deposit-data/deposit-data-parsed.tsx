import {
  Address,
  IconButton,
  IconTrash,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
  Typography,
} from '@lidofinance/lido-app-ui';
import { DATA_UNAVAILABLE } from 'consts';
import { useSmSDK, useTargetModule } from 'modules/web3';
import { FC, useCallback } from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import invariant from 'tiny-invariant';
import { useConfirmDeleteKeyModal } from './confirm-delete-key-modal-app';
import { ErrorList, TableScroll } from './styles';
import { DepositDataInputType } from './use-parse-deposit-data';

const TRASH_STYLE = { color: 'var(--lido-app-ui-color-icons-error)' };

// TODO: refactor to separate component and hook
export const DepositDataParsed: FC = () => {
  const targetModule = useTargetModule();
  const sm = useSmSDK(targetModule);
  const confirmDelete = useConfirmDeleteKeyModal();

  const { setValue, setError, clearErrors } =
    useFormContext<DepositDataInputType>();

  // Subscribe to errors here — reading them off useFormContext() is not
  // reactive in a child, leaving the row stale after async validation.
  const { errors, isValidating, isSubmitting } =
    useFormState<DepositDataInputType>({
      name: ['depositData', 'rawDepositData'],
    });

  const busy = isValidating || isSubmitting;
  const depositDataErrors = errors.depositData?.types;

  const [depositData, rawDepositData] = useWatch<
    DepositDataInputType,
    ['depositData', 'rawDepositData']
  >({
    name: ['depositData', 'rawDepositData'],
  });

  const remove = useCallback(
    (index: number) => {
      invariant(sm, 'deposit data needs a target module');
      const result = sm.depositData.removeKey(rawDepositData ?? '', index);

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
    [sm, rawDepositData, setValue, setError, clearErrors],
  );

  return (
    <TableScroll>
      <TableRoot variant="dense">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Recognized Pubkey</TableHeaderCell>
            <TableHeaderCell>Key number</TableHeaderCell>
            <TableHeaderCell align="right">Errors detected</TableHeaderCell>
            <TableHeaderCell align="right">Delete</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {depositData.map(({ pubkey }, index) => {
            const errors = depositDataErrors?.[index] as string[] | undefined;
            const hasError = !!errors?.length;
            const color = hasError ? 'error' : undefined;

            return (
              <TableRow key={pubkey} data-testid="deposit-data-row">
                <TableCell>
                  <Typography
                    as="span"
                    color={color}
                    data-testid="deposit-data-pubkey"
                  >
                    {pubkey ? (
                      <Address address={pubkey} symbols={8} tooltip copy />
                    ) : (
                      DATA_UNAVAILABLE
                    )}
                  </Typography>
                  {hasError && (
                    <ErrorList data-testid="deposit-data-error">
                      {errors?.map((error) => (
                        <Typography
                          key={error}
                          variant="caption"
                          color="secondary"
                        >
                          {error}
                        </Typography>
                      ))}
                    </ErrorList>
                  )}
                </TableCell>
                <TableCell data-testid="deposit-data-index">
                  <Typography as="span" color={color}>
                    #{index + 1}
                  </Typography>
                </TableCell>
                <TableCell
                  align="right"
                  data-testid="deposit-data-error-detected"
                >
                  <Typography as="span" color={color}>
                    {hasError ? 'Yes' : 'No'}
                  </Typography>
                </TableCell>
                <TableCell align="right" data-testid="deposit-data-delete-key">
                  <IconButton
                    icon={<IconTrash style={busy ? undefined : TRASH_STYLE} />}
                    type="button"
                    variant="ghost"
                    aria-label="Delete key"
                    onClick={async () => {
                      if (await confirmDelete({})) remove(index);
                    }}
                    disabled={busy}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </TableRoot>
    </TableScroll>
  );
};
