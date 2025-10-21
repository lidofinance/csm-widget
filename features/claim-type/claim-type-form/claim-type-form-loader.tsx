import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { ClaimTypeFormInputType, useClaimTypeFormData } from './context';
import { Info } from './controls/info';

export const ClaimTypeFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useFormState<ClaimTypeFormInputType>();
  const { canClaimCurve, proof, currentCurveId, newCurveId, icsPaused } =
    useClaimTypeFormData();

  const isClaimed =
    currentCurveId === newCurveId && currentCurveId !== undefined;
  const isEmpty = !proof?.proof || proof.isConsumed;
  const isView = !canClaimCurve;

  return (
    <WhenLoaded
      loading={isLoading}
      empty={
        icsPaused ? (
          <>ICS claiming is currently paused</>
        ) : isClaimed ? (
          <>You have already claimed the ICS operator type</>
        ) : (
          isEmpty && <>You are not eligible to claim the ICS operator type</>
        )
      }
    >
      {isView ? <Info /> : children}
    </WhenLoaded>
  );
};
