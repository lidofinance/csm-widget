import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { ChangeRoleFormInputType, useChangeRoleFormData } from './context';
import { Info } from './controls/info';

export const ChangeRoleFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useFormState<ChangeRoleFormInputType>();
  const { loading, isManagerReset, isRewardsChange, isPropose } =
    useChangeRoleFormData();

  const isView = !(isManagerReset || isRewardsChange || isPropose);

  return (
    <WhenLoaded loading={isLoading || loading.isInfoLoading}>
      {isView ? <Info /> : children}
    </WhenLoaded>
  );
};
