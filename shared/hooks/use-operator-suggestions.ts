import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useFeatureFlags } from 'config/feature-flags';
import { PATH } from 'consts';
import {
  OperatorRef,
  useIcsProof,
  useIdvtcProof,
  useOperatorIsOwner,
} from 'modules/web3';
import { isSurveysAvailable } from './is-surveys-available';
import { getSurveyDates } from './use-survey-enabled';
import { useSurveysFilled } from './use-surveys-filled';

export type Suggestion = {
  id: 'ics-claim' | 'idvtc-claim' | 'survey';
  text: string;
  cta: string;
  path: PATH;
  tooltip?: string;
};

// ICS wording mirrors the Figma IDVTC banner; confirm with design before release.
const ICS_CLAIM: Suggestion = {
  id: 'ics-claim',
  text: 'Identified Community Staker type is ready to claim',
  cta: 'Go to claim',
  path: PATH.TYPE_ICS_CLAIM,
};

const IDVTC_CLAIM: Suggestion = {
  id: 'idvtc-claim',
  text: 'Identified DVT Cluster type is ready to claim',
  cta: 'Go to claim',
  path: PATH.TYPE_IDVTC_CLAIM,
};

const SURVEY: Suggestion = {
  id: 'survey',
  text: 'Fill out the Validator and Node Operator Metrics survey',
  cta: 'Proceed',
  path: PATH.SURVEYS,
  tooltip:
    'Submit your validator setup data to help support transparency within the Lido Protocol',
};

export const useOperatorSuggestions = ({
  nodeOperatorId,
  module,
}: OperatorRef) => {
  const isCsm = module === MODULE_NAME.CSM;
  const { data: isOwner } = useOperatorIsOwner({
    nodeOperatorId: isCsm ? nodeOperatorId : undefined,
    module,
  });
  const { data: ics } = useIcsProof();
  const { data: idvtc } = useIdvtcProof();

  const featureFlags = useFeatureFlags();
  const surveysActive =
    isSurveysAvailable(module, featureFlags) && getSurveyDates().isActive;
  const { data: filled } = useSurveysFilled({
    nodeOperatorId: surveysActive ? nodeOperatorId : undefined,
    module,
  });

  const list: Suggestion[] = [];
  if (isCsm && isOwner && ics?.proof && !ics.isConsumed) list.push(ICS_CLAIM);
  if (isCsm && isOwner && idvtc?.proof && !idvtc.isConsumed)
    list.push(IDVTC_CLAIM);
  if (filled?.isFilled === false) list.push(SURVEY);
  return list;
};
