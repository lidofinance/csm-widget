import { KEYS_UPLOAD_TX_LIMIT } from 'consts/keys';
import { pluralKeys } from 'utils/plural';

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
