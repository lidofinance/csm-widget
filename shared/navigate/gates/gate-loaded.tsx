import { FC, PropsWithChildren, ReactNode } from 'react';
import { useInitialLoading } from 'shared/hooks';
import { SplashPage, UnavailablePage, UnsupportedPage } from '../inner-pages';
import { useAddressValidation } from 'providers/address-validation-provider';

type Props = {
  fallback?: ReactNode;
  unsupported?: ReactNode;
  additional?: boolean;
};

export const GateLoaded: FC<PropsWithChildren<Props>> = ({
  fallback = <SplashPage />,
  unsupported = <UnsupportedPage />,
  additional,
  children,
}) => {
  const { isLoading, isSupported } = useInitialLoading(additional);
  const { isNotValidAddress } = useAddressValidation();

  if (isNotValidAddress) {
    return <UnavailablePage />;
  }

  if (!isSupported) {
    return <>{unsupported}</>;
  }

  return <>{isLoading ? fallback : children}</>;
};
