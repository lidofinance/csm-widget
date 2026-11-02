import { KEYS_UPLOAD_TX_LIMIT } from 'consts/keys';
import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import { pluralKeys } from 'utils/plural';

export const KEYS_LIMIT_REASON = 'Keys limit has reached';

export const AMOUNT_TOOLTIP =
  'This field is calculated automatically based on the number of keys and the bond curve. Follow the FAQ section to learn more.';

export const KEYS_CONFIRM_CM =
  'I confirm that my nodes are synced, running, and ready for the validator activation';

export type KeysLimitInput = {
  keysLimit?: number;
  nonWithdrawnKeys?: number;
};

export type KeysLimitState = {
  gap: number;
  reached: boolean;
  message: string;
};

/** Undefined while the limit is unknown or a full upload still fits. */
export const getKeysLimitState = ({
  keysLimit,
  nonWithdrawnKeys,
}: KeysLimitInput): KeysLimitState | undefined => {
  if (keysLimit === undefined || nonWithdrawnKeys === undefined) {
    return undefined;
  }

  const gap = keysLimit - nonWithdrawnKeys;
  if (gap >= KEYS_UPLOAD_TX_LIMIT) return undefined;

  const reached = gap <= 0;

  return {
    gap,
    reached,
    message: reached
      ? "Keys limit reached. New keys can't be uploaded until some of the current keys are withdrawn."
      : `Approaching the keys limit. Only ${gap} more ${pluralKeys({ value: gap })} can be uploaded.`,
  };
};

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
        label: BOND_INSUFFICIENT,
        hint: 'Will be added to the transaction amount',
        amount: bond.delta,
      }
    : {
        insufficient: false,
        label: BOND_EXCESS,
        hint: 'Will be subtracted from the transaction amount',
        amount: bond.delta,
      };
};

export type KeysConfirmInput = {
  approaching: boolean;
  reached: boolean;
};

/** Lines after "I confirm that:"; the label is one sentence, so the last line has no dot. */
export const getKeysConfirmItems = ({
  approaching,
  reached,
}: KeysConfirmInput): string[] => {
  const items = [
    'My nodes are synced, running, and ready for the validator activation',
    ...(approaching
      ? [
          'I understand that the deposit time for my keys can be months or longer because CSM is approaching its stake share limit',
        ]
      : []),
    ...(reached
      ? [
          'I understand that my newly uploaded keys are very unlikely to receive deposits in the near future because CSM has reached its stake share limit',
        ]
      : []),
    'I understand that deleting keys from the deposit queue will incur a removal fee',
  ];

  return items.map((item, index) =>
    index < items.length - 1 ? `${item},` : item,
  );
};
