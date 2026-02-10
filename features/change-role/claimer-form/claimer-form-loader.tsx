import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useClaimerFormData } from './context';
import { Info } from './controls/info';

export const ClaimerFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { isOwner } = useClaimerFormData();

  return <FormLoader>{isOwner ? children : <Info />}</FormLoader>;
};
