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
      title="You are eligible to claim a new operator type"
      titleTestId="formTitle"
      description={`You can change your operator type from ${currentMetadata?.name ?? 'your current type'} to Identified Community Staker (ICS). Claiming ICS will update several parameters for your Node Operator. Review the changes below before continuing.`}
    >
      <ClaimChanges
        title="What’s changing"
        from={currentParameters}
        to={newParameters}
        fromLabel={`Current (${currentMetadata?.short ?? ''})`}
        toLabel={`New (${newMetadata?.short ?? ''})`}
      />
      {cta}
    </ClaimTypeCard>
  );
};
