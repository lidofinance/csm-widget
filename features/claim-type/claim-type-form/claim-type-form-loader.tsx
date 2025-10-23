import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { useClaimTypeFormData } from './context';
import { Info } from './controls/info';
import { ClaimTypeSuccess } from './claim-type-success';

export const ClaimTypeFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const {
    canClaimCurve,
    proof,
    currentCurveId,
    newCurveId,
    icsPaused,
    justClaimed,
  } = useClaimTypeFormData();

  const isClaimed =
    currentCurveId === newCurveId && currentCurveId !== undefined;
  const isEmpty = !proof?.proof || proof.isConsumed;
  const isView = !canClaimCurve;

  if (justClaimed) {
    return <ClaimTypeSuccess />;
  }

  return (
    <FormLoader
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
    </FormLoader>
  );
};
