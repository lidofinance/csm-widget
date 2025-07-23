import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { ClaimTypeFormInputType, useClaimTypeFormData } from './context';
import { Info } from './controls/info';

export const ClaimTypeFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useFormState<ClaimTypeFormInputType>();
  const { canClaimCurve, proof } = useClaimTypeFormData();

  const isEmpty = !proof?.proof || proof.isConsumed;
  const isView = !canClaimCurve;

  return (
    <WhenLoaded
      loading={isLoading}
      empty={isEmpty && <>You have no proof to claim the ICS operator type</>}
    >
      {isView ? <Info /> : children}
    </WhenLoaded>
  );
};
