import { FC } from 'react';
import { MainAddressSection } from 'shared/node-operator/type-apply';
import { useApplyFormData } from '../context';

export const MainAddress: FC = () => {
  const { mainAddress } = useApplyFormData(true);

  return (
    <MainAddressSection
      address={mainAddress}
      subtitle="You are requesting ICS operator type for the following address:"
    />
  );
};
