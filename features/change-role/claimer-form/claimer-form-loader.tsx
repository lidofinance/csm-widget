import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useClaimerFlow } from './context';
import { Info } from './controls/info';

export const ClaimerFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const flow = useClaimerFlow();

  return (
    <FormLoader>
      {flow.action === 'view' ? <Info /> : <>{children}</>}
    </FormLoader>
  );
};
