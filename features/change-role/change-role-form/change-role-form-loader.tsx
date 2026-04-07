import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useChangeRoleFlow } from './context';
import { Info } from './controls/info';

export const ChangeRoleFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const flow = useChangeRoleFlow();

  return (
    <FormLoader>
      {flow.action === 'view' ? <Info /> : <>{children}</>}
    </FormLoader>
  );
};
