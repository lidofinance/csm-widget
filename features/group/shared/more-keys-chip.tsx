import { FC } from 'react';
import { Alert, Check, SquaredChip } from 'shared/components';

type Props = {
  more: boolean;
  empty?: boolean;
  isPending?: boolean;
};

export const MoreKeysChip: FC<Props> = ({ more, empty, isPending }) => {
  if (isPending) return null;

  return (
    <SquaredChip
      data-testid="moreKeysChip"
      variant={more ? (empty ? 'error' : 'warning') : 'success'}
    >
      {more ? (
        <>
          <Alert />
          {empty ? 'Upload keys' : 'Upload more keys'}
        </>
      ) : (
        <>
          <Check />
          Enough keys
        </>
      )}
    </SquaredChip>
  );
};
