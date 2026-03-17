import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useChangeRoleFormData } from './context';
import { Info } from './controls/info';

export const ChangeRoleFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { mode } = useChangeRoleFormData();

  const isView = mode === 'view';

  return <FormLoader>{isView ? <Info /> : children}</FormLoader>;
};
