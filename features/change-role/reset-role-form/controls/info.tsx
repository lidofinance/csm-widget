import { FC } from 'react';
import { Latice, TitledAddress, Warning } from 'shared/components';
import { useResetRoleFormData } from '../context';

export const Info: FC = () => {
  const { currentAddress, proposedAddress } = useResetRoleFormData();

  return (
    <>
      <Latice variant="secondary">
        <TitledAddress
          title={`Current manager address`}
          address={currentAddress}
        />
        <TitledAddress
          title={<Warning text="Pending change" />}
          address={proposedAddress}
        />
      </Latice>
    </>
  );
};
