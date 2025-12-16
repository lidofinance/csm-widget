import { FC } from 'react';
import { Button } from '@lidofinance/lido-ui';
import { Stack } from 'shared/components';
import { Address } from 'shared/components/address';
import { Delegate } from '../types';

type DelegateItemProps = {
  delegate: Delegate;
  onRemove: () => void;
  isRemoving?: boolean;
};

export const DelegateItem: FC<DelegateItemProps> = ({
  delegate,
  onRemove,
  isRemoving,
}) => {
  return (
    <Stack align="center" spaceBetween>
      <Address address={delegate.address} showIcon />
      <Button
        size="xs"
        variant="text"
        color="error"
        onClick={onRemove}
        loading={isRemoving}
      >
        Remove
      </Button>
    </Stack>
  );
};
