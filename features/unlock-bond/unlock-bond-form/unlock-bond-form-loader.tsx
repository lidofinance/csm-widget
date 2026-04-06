import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useShowFlags } from 'shared/hooks';
import { useUnlockBondFormData } from './context';
import { Info } from './controls/info';

export const UnlockBondFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { HAS_MANAGER_ROLE } = useShowFlags();
  const { bond, isExpired } = useUnlockBondFormData();

  const isView = !bond?.locked || (!isExpired && !HAS_MANAGER_ROLE);

  return <FormLoader>{isView ? <Info /> : children}</FormLoader>;
};
