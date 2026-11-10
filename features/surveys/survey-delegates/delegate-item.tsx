import { FC } from 'react';
import { Address, Button } from '@lidofinance/lido-app-ui';
import { HubRow } from 'shared/components/hub-list';
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
}) => (
  <HubRow
    title={<Address address={delegate.address} identicon={24} copy />}
    trailing={
      <Button
        variant="outline"
        size="small"
        onClick={onRemove}
        loading={isRemoving}
      >
        Remove
      </Button>
    }
  />
);
