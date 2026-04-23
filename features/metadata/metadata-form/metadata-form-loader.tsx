import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useMetadataFlow } from './context';
import { Info } from './controls/info';

const MetadataFormGate: FC<PropsWithChildren> = ({ children }) => {
  const flow = useMetadataFlow();
  const isReadOnly =
    flow.action === 'no-access' || flow.action === 'restricted';
  return isReadOnly ? <Info /> : <>{children}</>;
};

export const MetadataFormLoader: FC<PropsWithChildren> = ({ children }) => (
  <FormLoader>
    <MetadataFormGate>{children}</MetadataFormGate>
  </FormLoader>
);
