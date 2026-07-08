import { KEYS_UPLOAD_TX_LIMIT } from 'consts';
import { FC } from 'react';
import { WarningBlock } from '../warning-block/warning-block';
import { pluralKeys } from 'utils';

type Props = {
  keysLimit?: number;
  nonWithdrawnKeys?: number;
};

export const KeysLimitWarning: FC<Props> = ({
  keysLimit,
  nonWithdrawnKeys,
}) => {
  if (keysLimit === undefined || nonWithdrawnKeys === undefined) {
    return null;
  }

  const gap = keysLimit - nonWithdrawnKeys;

  if (gap >= KEYS_UPLOAD_TX_LIMIT) {
    return null;
  }

  return (
    <WarningBlock type="warning" data-testid="keysLimitWarning">
      {gap <= 0
        ? "Keys limit reached. New keys can't be uploaded until some of the current keys are withdrawn."
        : `Approaching the keys limit. Only ${gap} more ${pluralKeys({ value: gap })} can be uploaded.`}
    </WarningBlock>
  );
};
