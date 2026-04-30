import { FC } from 'react';
import { SquaredChip } from 'shared/components';
import { Alert, Check } from 'features/dashboard/keys/keys-breakdown/styles';

type Props = {
  more: boolean;
  empty?: boolean;
  isPending?: boolean;
};

export const MoreKeysChip: FC<Props> = ({ more, empty, isPending }) => {
  if (isPending) return null;

  return (
    <SquaredChip variant={more ? (empty ? 'error' : 'warning') : 'success'}>
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
