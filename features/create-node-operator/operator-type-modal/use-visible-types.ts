import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { OPERATOR_TYPE_METADATA } from 'consts';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { CREATE_PATH_BY_TYPE, PATH } from 'consts/urls';
import {
  useIcsPaused,
  useIcsProof,
  useIdvtcPaused,
  useIdvtcProof,
} from 'modules/web3';
import { useMemo } from 'react';
import {
  useCanCreateNodeOperator,
  useHasUnconsumedProof,
  useShowFlags,
} from 'shared/hooks';

export type VisibleType = {
  type: OPERATOR_TYPE;
  href: PATH;
  label: string;
  matomoEvent: MATOMO_CLICK_EVENTS_TYPES;
  primary: boolean;
};

type ProofData = { proof?: unknown; isConsumed?: boolean } | undefined;

const buildApplyEntry = <T extends keyof typeof CREATE_PATH_BY_TYPE>(
  type: T,
  applyPath: PATH,
  applyEvent: MATOMO_CLICK_EVENTS_TYPES,
  createEvent: MATOMO_CLICK_EVENTS_TYPES,
  proof: ProofData,
  paused: boolean | undefined,
  canCreate: boolean,
): VisibleType | null => {
  if (paused || proof?.isConsumed) return null;
  const { short } = OPERATOR_TYPE_METADATA[type];
  return proof?.proof && canCreate
    ? {
        type,
        href: CREATE_PATH_BY_TYPE[type],
        label: `Create ${short} operator`,
        matomoEvent: createEvent,
        primary: true,
      }
    : {
        type,
        href: applyPath,
        label: `Apply for ${short}`,
        matomoEvent: applyEvent,
        primary: false,
      };
};

export const useVisibleTypes = (): VisibleType[] => {
  const { ICS_APPLY_ENABLED } = useShowFlags();
  const { data: icsProof } = useIcsProof();
  const { data: idvtcProof } = useIdvtcProof();
  const { data: icsPaused } = useIcsPaused();
  const { data: idvtcPaused } = useIdvtcPaused();
  const { byType } = useCanCreateNodeOperator();
  const hasUnconsumedProof = useHasUnconsumedProof();

  return useMemo(() => {
    const csm02: VisibleType | null = byType[OPERATOR_TYPE.CSM2_DEF]
      ? {
          type: OPERATOR_TYPE.CSM2_DEF,
          href: CREATE_PATH_BY_TYPE[OPERATOR_TYPE.CSM2_DEF],
          label: 'Join now',
          matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalJoinCsm02,
          primary: true,
        }
      : null;

    const def: VisibleType | null =
      byType[OPERATOR_TYPE.CSM_DEF] && !hasUnconsumedProof
        ? {
            type: OPERATOR_TYPE.CSM_DEF,
            href: CREATE_PATH_BY_TYPE[OPERATOR_TYPE.CSM_DEF],
            label: 'Join now',
            matomoEvent:
              MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalJoinPermissionless,
            primary: true,
          }
        : null;

    if (!ICS_APPLY_ENABLED) {
      return [def, csm02].filter((x): x is VisibleType => x !== null);
    }

    const ics = buildApplyEntry(
      OPERATOR_TYPE.CSM_ICS,
      PATH.TYPE_ICS_APPLY,
      MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalApplyIcs,
      MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalCreateIcs,
      icsProof,
      icsPaused,
      byType[OPERATOR_TYPE.CSM_ICS],
    );
    const idvtc = buildApplyEntry(
      OPERATOR_TYPE.CSM_IDVTC,
      PATH.TYPE_IDVTC_APPLY,
      MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalApplyIdvtc,
      MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalCreateIdvtc,
      idvtcProof,
      idvtcPaused,
      byType[OPERATOR_TYPE.CSM_IDVTC],
    );

    return [def, ics, idvtc, csm02].filter((x): x is VisibleType => x !== null);
  }, [
    ICS_APPLY_ENABLED,
    icsProof,
    idvtcProof,
    icsPaused,
    idvtcPaused,
    byType,
    hasUnconsumedProof,
  ]);
};
