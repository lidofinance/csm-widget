import { FC, PropsWithChildren, ReactNode } from 'react';
import { useCsmEarlyAdoption, useCsmStatus } from 'shared/hooks';

type Props = {
  fallback?: ReactNode;
};

export const GateCanCreate: FC<PropsWithChildren<Props>> = ({
  fallback,
  children,
}) => {
  const { data } = useCsmStatus();
  const {
    data: { proof, consumed },
  } = useCsmEarlyAdoption();

  const active = data?.isPublicRelease || (!!proof && !consumed);

  if (!active) return fallback;

  return children;
};
