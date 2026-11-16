const BOND_INSUFFICIENT_LABEL = 'Insufficient Bond';
const BOND_EXCESS_LABEL = 'Excess Bond';

export const KEYS_LIMIT_REASON = 'Keys limit has reached';

export const KEYS_CONFIRM_CM =
  'I confirm that my nodes are synced, running, and ready for the validator activation';

export { getKeysLimitState } from 'shared/components/keys-limit-warning/keys-limit-state';
export type {
  KeysLimitInput,
  KeysLimitState,
} from 'shared/components/keys-limit-warning/keys-limit-state';

export type BondDeltaInput = {
  delta?: bigint;
  isInsufficient?: boolean;
};

export type BondDeltaRow = {
  insufficient: boolean;
  label: string;
  hint: string;
  amount: bigint;
};

export const getBondDeltaRow = (
  bond?: BondDeltaInput,
): BondDeltaRow | undefined => {
  if (!bond?.delta) return undefined;

  return bond.isInsufficient
    ? {
        insufficient: true,
        label: BOND_INSUFFICIENT_LABEL,
        hint: 'Will be added to the transaction amount',
        amount: bond.delta,
      }
    : {
        insufficient: false,
        label: BOND_EXCESS_LABEL,
        hint: 'Will be subtracted from the transaction amount',
        amount: bond.delta,
      };
};

export type KeysConfirmInput = {
  approaching: boolean;
  reached: boolean;
  name: string;
};

/** Lines after "I confirm that:"; the label is one sentence, so the last line has no dot. */
export const getKeysConfirmItems = ({
  approaching,
  reached,
  name,
}: KeysConfirmInput): string[] => {
  const items = [
    'My nodes are synced, running, and ready for the validator activation',
    ...(approaching
      ? [
          `I understand that the deposit time for my keys can be months or longer because ${name} is approaching its stake share limit`,
        ]
      : []),
    ...(reached
      ? [
          `I understand that my newly uploaded keys are very unlikely to receive deposits in the near future because ${name} has reached its stake share limit`,
        ]
      : []),
    'I understand that deleting keys from the deposit queue will incur a removal fee',
  ];

  return items.map((item, index) =>
    index < items.length - 1 ? `${item},` : item,
  );
};
