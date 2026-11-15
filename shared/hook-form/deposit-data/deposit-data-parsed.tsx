import {
  Address,
  IconButton,
  IconTrash,
  Table,
  TableColumn,
  Typography,
} from '@lidofinance/lido-app-ui';
import { DATA_UNAVAILABLE } from 'consts';
import { useSmSDK, useTargetModule } from 'modules/web3';
import { FC, useCallback, useMemo } from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import invariant from 'tiny-invariant';
import { useConfirmDeleteKeyModal } from './confirm-delete-key-modal-app';
import { ErrorList } from './styles';
import { DepositDataInputType } from './use-parse-deposit-data';

type ParsedRow = {
  pubkey: string;
  index: number;
  errors?: string[];
};

const getRowKey = ({ pubkey }: ParsedRow) => pubkey;
const getRowProps = () => ({ 'data-testid': 'deposit-data-row' }) as object;

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

  const rows = useMemo<ParsedRow[]>(
    () =>
      depositData.map(({ pubkey }, index) => ({
        pubkey,
        index,
        errors: depositDataErrors?.[index] as string[] | undefined,
      })),
    [depositData, depositDataErrors],
  );

  const columns: TableColumn<ParsedRow>[] = [
    {
      key: 'pubkey',
      header: 'Recognized Pubkey',
      render: ({ pubkey, errors }) => (
        <>
          <Typography
            as="span"
            color={errors?.length ? 'error' : undefined}
            data-testid="deposit-data-pubkey"
          >
            {pubkey ? (
              <Address address={pubkey} symbols={8} tooltip copy />
            ) : (
              DATA_UNAVAILABLE
            )}
          </Typography>
          {!!errors?.length && (
            <ErrorList data-testid="deposit-data-error">
              {errors.map((error) => (
                <Typography key={error} variant="caption" color="secondary">
                  {error}
                </Typography>
              ))}
            </ErrorList>
          )}
        </>
      ),
    },
    {
      key: 'index',
      header: 'Key number',
      render: ({ index, errors }) => (
        <Typography
          as="span"
          color={errors?.length ? 'error' : undefined}
          data-testid="deposit-data-index"
        >
          #{index + 1}
        </Typography>
      ),
    },
    {
      key: 'errors',
      header: 'Errors detected',
      align: 'right',
      render: ({ errors }) => (
        <Typography
          as="span"
          color={errors?.length ? 'error' : undefined}
          data-testid="deposit-data-error-detected"
        >
          {errors?.length ? 'Yes' : 'No'}
        </Typography>
      ),
    },
    {
      key: 'delete',
      header: 'Delete',
      align: 'right',
      render: ({ index }) => (
        <span data-testid="deposit-data-delete-key">
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
        </span>
      ),
    },
  ];

  return (
    <Table
      variant="dense"
      stickyHeader
      maxHeight={150}
      columns={columns}
      rows={rows}
      rowKey={getRowKey}
      getRowProps={getRowProps}
    />
  );
};
