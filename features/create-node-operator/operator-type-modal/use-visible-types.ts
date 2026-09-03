import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { OPERATOR_TYPE_METADATA } from 'consts';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import {
  useIcsPaused,
  useIcsProof,
  useIdvtcPaused,
  useIdvtcProof,
} from 'modules/web3';
import { useMemo } from 'react';
import {
  getOperatorTypeQuery,
  useCanCreateNodeOperator,
  useShowFlags,
} from 'shared/hooks';

export type VisibleType = {
  type: OPERATOR_TYPE;
  href: PATH;
  query?: Record<string, string>;
  label: string;
  matomoEvent: MATOMO_CLICK_EVENTS_TYPES;
  primary: boolean;
};

type ProofData = { proof?: unknown; isConsumed?: boolean } | undefined;

const buildApplyEntry = (
  type: OPERATOR_TYPE,
  applyPath: PATH,
  applyEvent: MATOMO_CLICK_EVENTS_TYPES,
  createEvent: MATOMO_CLICK_EVENTS_TYPES,
  proof: ProofData,
  paused: boolean | undefined,
): VisibleType | null => {
  if (paused || proof?.isConsumed) return null;
  const { short } = OPERATOR_TYPE_METADATA[type];
  return proof?.proof
    ? {
        type,
        href: PATH.CREATE,
        query: getOperatorTypeQuery(type),
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
  const { creatableModules } = useCanCreateNodeOperator();

  const isCsm02Creatable = creatableModules.includes(MODULE_NAME.CSM_02);
  const isCsmCreatable = creatableModules.includes(MODULE_NAME.CSM);

  return useMemo(() => {
    const csm02: VisibleType | null = isCsm02Creatable
      ? {
          type: OPERATOR_TYPE.CSM2_DEF,
          href: PATH.CREATE,
          query: getOperatorTypeQuery(OPERATOR_TYPE.CSM2_DEF),
          label: 'Join now',
          matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalJoinCsm02,
          primary: true,
        }
      : null;

    const hasAnyProof = Boolean(icsProof?.proof || idvtcProof?.proof);
    const def: VisibleType | null =
      hasAnyProof || !isCsmCreatable
        ? null
        : {
            type: OPERATOR_TYPE.CSM_DEF,
            href: PATH.CREATE,
            label: 'Join now',
            matomoEvent:
              MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalJoinPermissionless,
            primary: true,
          };

    if (!ICS_APPLY_ENABLED || !isCsmCreatable) {
      return [def, csm02].filter((x): x is VisibleType => x !== null);
    }

    const ics = buildApplyEntry(
      OPERATOR_TYPE.CSM_ICS,
      PATH.TYPE_ICS_APPLY,
      MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalApplyIcs,
      MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalCreateIcs,
      icsProof,
      icsPaused,
    );
    const idvtc = buildApplyEntry(
      OPERATOR_TYPE.CSM_IDVTC,
      PATH.TYPE_IDVTC_APPLY,
      MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalApplyIdvtc,
      MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalCreateIdvtc,
      idvtcProof,
      idvtcPaused,
    );

    return [def, ics, idvtc, csm02].filter((x): x is VisibleType => x !== null);
  }, [
    ICS_APPLY_ENABLED,
    icsProof,
    idvtcProof,
    icsPaused,
    idvtcPaused,
    isCsm02Creatable,
    isCsmCreatable,
  ]);
};
