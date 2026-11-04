import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FC, ReactNode } from 'react';
import { useCurveMetadata, useDisplayOperatorType } from 'shared/hooks';
import { ClaimChanges, ClaimTypeBadges, ClaimTypeCard } from '../shared';
import { useClaimIcsFormData } from './context';

export const ClaimIcsCard: FC<{ cta: ReactNode }> = ({ cta }) => {
  const { currentCurve, newCurve, currentParameters, newParameters } =
    useClaimIcsFormData(true);
  const currentType = useDisplayOperatorType(currentCurve);
  const currentMetadata = useCurveMetadata(currentCurve);
  const newMetadata = useCurveMetadata(newCurve);

  return (
    <ClaimTypeCard
      badges={<ClaimTypeBadges from={currentType} to={OPERATOR_TYPE.CSM_ICS} />}
      title="Claim Identified Community Staker operator type"
      titleTestId="formTitle"
      description="You are eligible to claim a new operator type. Claiming the Identified Community Staker operator type will change some parameters for your node operator according to the section below."
    >
      <ClaimChanges
        title="What's changing"
        from={currentParameters}
        to={newParameters}
        fromLabel={`Current (${currentMetadata?.short ?? ''})`}
        toLabel={`New (${newMetadata?.short ?? ''})`}
      />
      {cta}
    </ClaimTypeCard>
  );
};
