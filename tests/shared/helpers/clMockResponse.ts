// The beacon API answer of the CL mock: the validators the widget asks about,
// with the statuses set for them. Shared by the e2e mock
// (services/clMock.service.ts) and `yarn cl-mock` (scripts/cl-mock), so both
// answer the same way. No path aliases: plain node runs it.

export const CL_VALIDATORS_PATH = '/eth/v1/beacon/states/head/validators';

const FAR_FUTURE_EPOCH = '18446744073709551615';

/** Key status → the beacon status the SDK maps to it */
export const CL_STATUS = {
  ACTIVATION_PENDING: 'pending_queued',
  ACTIVE: 'active_ongoing',
  EXITING: 'active_exiting',
  SLASHED: 'active_slashed',
  WITHDRAWAL_PENDING: 'exited_unslashed',
  WITHDRAWN: 'withdrawal_done',
} as const;

export type ClKeyStatus = keyof typeof CL_STATUS;

/** Lowercase pubkey → status */
export type ClStates = Record<string, ClKeyStatus>;

type ClValidator = {
  index: string;
  balance: string;
  status: string;
  validator: Record<string, string | boolean>;
};

export type ClResponse = {
  execution_optimistic: boolean;
  finalized: boolean;
  data: ClValidator[];
};

const toValidator = (
  pubkey: string,
  status: ClKeyStatus,
  index: number,
): ClValidator => ({
  // far above real indexes
  index: String(10_000_000 + index),
  balance: '32000000000',
  status: CL_STATUS[status],
  validator: {
    pubkey,
    withdrawal_credentials: `0x${'0'.repeat(64)}`,
    effective_balance: '32000000000',
    slashed: status === 'SLASHED',
    activation_eligibility_epoch: '0',
    // 0 is long ago, so the SDK also marks an active key EJECTABLE
    activation_epoch: status === 'ACTIVATION_PENDING' ? FAR_FUTURE_EPOCH : '0',
    exit_epoch: FAR_FUTURE_EPOCH,
    withdrawable_epoch: FAR_FUTURE_EPOCH,
  },
});

/**
 * Mocked validators for the requested pubkeys that have a status, plus the
 * real CL answer for the rest
 */
export const buildClResponse = (
  states: ClStates,
  ids: string[],
  real?: ClResponse,
): ClResponse => {
  const pubkeys = ids.map((id) => id.toLowerCase());
  const mocked = Object.keys(states);

  return {
    execution_optimistic: false,
    finalized: true,
    data: [
      ...(real?.data ?? []).filter(
        ({ validator }) => !(String(validator.pubkey).toLowerCase() in states),
      ),
      ...pubkeys
        .filter((pubkey) => pubkey in states)
        .map((pubkey) =>
          toValidator(pubkey, states[pubkey], mocked.indexOf(pubkey)),
        ),
    ],
  };
};
