import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
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
import { getOperatorTypeQuery, useShowFlags } from 'shared/hooks';

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

  return useMemo(() => {
    if (!ICS_APPLY_ENABLED) return [];

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
      PATH.TYPE_DVT_APPLY,
      MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalApplyIdvtc,
      MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalCreateIdvtc,
      idvtcProof,
      idvtcPaused,
    );

    const hasAnyProof = Boolean(icsProof?.proof || idvtcProof?.proof);
    const def: VisibleType | null = hasAnyProof
      ? null
      : {
          type: OPERATOR_TYPE.CSM_DEF,
          href: PATH.CREATE,
          label: 'Join now',
          matomoEvent:
            MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalJoinPermissionless,
          primary: true,
        };

    return [def, ics, idvtc].filter((x): x is VisibleType => x !== null);
  }, [ICS_APPLY_ENABLED, icsProof, idvtcProof, icsPaused, idvtcPaused]);
};
