import { Button, SectionTitle } from '@lidofinance/lido-app-ui';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { FC, ReactNode } from 'react';
import { SubmitButton } from 'shared/form-page';
import { useCurveMetadata, useDisplayOperatorType } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import { ClaimChanges, ClaimTypeBadges, ClaimTypeCard } from '../shared';
import { getClaimIdvtcCopy } from './claim-idvtc-copy';
import { useClaimIdvtcFormData } from './context';
import { CardsGridStyle, NarrowStyle, TwoCardsStyle } from './styles';

const useClaimCurves = () => {
  const { currentCurve, newCurve, currentParameters, newParameters } =
    useClaimIdvtcFormData(true);
  const currentType = useDisplayOperatorType(currentCurve);
  const currentShort = useCurveMetadata(currentCurve)?.short ?? '';
  const newShort = useCurveMetadata(newCurve)?.short ?? '';

  return {
    currentType,
    currentShort,
    newShort,
    currentParameters,
    newParameters,
  };
};

export const CreateIdvtcButton: FC = () => {
  const navigate = useNavigate();

  return (
    <Button fullWidth onClick={() => void navigate(PATH.CREATE_IDVTC)}>
      Create a new IDVTC operator
    </Button>
  );
};

export const ClaimIdvtcSubmitButton: FC = () => {
  const { isCurrentIcs } = useClaimIdvtcFormData(true);

  return <SubmitButton>{getClaimIdvtcCopy(isCurrentIcs).cta}</SubmitButton>;
};

const WhatsChanging: FC = () => {
  const { currentShort, newShort, currentParameters, newParameters } =
    useClaimCurves();

  return (
    <ClaimChanges
      title="What’s changing"
      from={currentParameters}
      to={newParameters}
      fromLabel={`Current (${currentShort})`}
      toLabel={`New (${newShort})`}
    />
  );
};

const ClaimCard: FC<{ cta: ReactNode }> = ({ cta }) => {
  const { currentType } = useClaimCurves();
  const copy = getClaimIdvtcCopy(false);

  return (
    <ClaimTypeCard
      badges={
        <ClaimTypeBadges from={currentType} to={OPERATOR_TYPE.CSM_IDVTC} />
      }
      title={copy.title}
      titleTestId="formTitle"
      description={copy.description}
    >
      <WhatsChanging />
      {cta}
    </ClaimTypeCard>
  );
};

const UpgradeCard: FC<{ cta: ReactNode }> = ({ cta }) => (
  <ClaimTypeCard
    badges={
      <ClaimTypeBadges
        from={OPERATOR_TYPE.CSM_ICS}
        to={OPERATOR_TYPE.CSM_IDVTC}
      />
    }
    title="Upgrade ICS to IDVTC"
    description="Claiming the Identified DVT Cluster operator type will change some parameters for your Node Operator according to the section below"
  >
    <WhatsChanging />
    {cta}
  </ClaimTypeCard>
);

const CreateCard: FC = () => {
  const { currentShort, newShort, currentParameters, newParameters } =
    useClaimCurves();

  return (
    <ClaimTypeCard
      badges={
        <ClaimTypeBadges
          from={OPERATOR_TYPE.CSM_ICS}
          to={OPERATOR_TYPE.CSM_IDVTC}
          join="plus"
        />
      }
      title="Create a new IDVTC operator"
      description="Creating a separate Node Operator with the IDVTC operator type will keep your current ICS status alongside with the new IDVTC type"
    >
      <ClaimChanges
        title="Your two operators"
        variant="compare"
        from={currentParameters}
        to={newParameters}
        fromLabel={currentShort}
        toLabel={newShort}
        data-testid="claimCompare"
      />
      <CreateIdvtcButton />
    </ClaimTypeCard>
  );
};

export const ClaimIdvtcCards: FC<{ cta: ReactNode }> = ({ cta }) => {
  const { isCurrentIcs } = useClaimIdvtcFormData(true);

  if (!isCurrentIcs) {
    return (
      <NarrowStyle>
        <ClaimCard cta={cta} />
      </NarrowStyle>
    );
  }

  const copy = getClaimIdvtcCopy(true);

  return (
    <TwoCardsStyle>
      <SectionTitle
        size="large"
        title={copy.title}
        subtitle={copy.description}
        dataTestId={{ root: 'formTitle' }}
      />
      <CardsGridStyle>
        <UpgradeCard cta={cta} />
        <CreateCard />
      </CardsGridStyle>
    </TwoCardsStyle>
  );
};
