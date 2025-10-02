import { useCsmVersionSupported } from 'modules/web3';
import { useAddressValidation } from 'providers/address-validation-provider';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { SplashPage, UnsupportedPage } from '../inner-pages';
import { UnavailablePage } from '../inner-pages/unavailable-page';

type Props = {
  fallback?: ReactNode;
  unsupported?: ReactNode;
  additional?: boolean;
};

export const GateSupported: FC<PropsWithChildren<Props>> = ({
  fallback = <SplashPage />,
  unsupported = <UnsupportedPage />,
  children,
}) => {
  const { data: isSupported, isPending } = useCsmVersionSupported();

  const { isNotValidAddress } = useAddressValidation();

  if (isNotValidAddress) {
    return <UnavailablePage />;
  }

  return <>{isPending ? fallback : isSupported ? children : unsupported}</>;
};
