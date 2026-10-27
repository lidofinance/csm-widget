import {
  useDappStatus,
  useModule,
  useNodeOperator,
  useSmVersionSupported,
} from 'modules/web3';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { SplashPage, UnsupportedPage } from '../inner-pages';

type Props = {
  fallback?: ReactNode;
  unsupported?: ReactNode;
};

export const GateSupported: FC<PropsWithChildren<Props>> = ({
  fallback = <SplashPage />,
  unsupported = <UnsupportedPage />,
  children,
}) => {
  const { isAccountActive } = useDappStatus();
  const { isPending: isOperatorPending } = useNodeOperator();
  const { module } = useModule();
  // no module yet → checks every deployed module; wait for the operator so we check the right one
  const { data: isSupported, isPending } = useSmVersionSupported(module);

  if (isPending || (isAccountActive && isOperatorPending)) {
    return <>{fallback}</>;
  }
  return <>{isSupported ? children : unsupported}</>;
};
