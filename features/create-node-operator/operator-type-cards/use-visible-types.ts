import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { OPERATOR_TYPE_METADATA } from 'consts';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { CREATE_PATH_BY_TYPE, PATH } from 'consts/urls';
import { useMemo } from 'react';
import {
  ApplicableOperatorType,
  CreatableOperatorType,
  CreateOption,
  useCreateOptions,
} from 'shared/hooks';

export type VisibleType = {
  type: OPERATOR_TYPE;
  href: PATH;
  label: string;
  matomoEvent: MATOMO_CLICK_EVENTS_TYPES;
  primary: boolean;
};

type Presentation = { label: string; matomoEvent: MATOMO_CLICK_EVENTS_TYPES };

const CREATE_PRESENTATION: Record<CreatableOperatorType, Presentation> = {
  [OPERATOR_TYPE.CSM_DEF]: {
    label: 'Join now',
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalJoinPermissionless,
  },
  [OPERATOR_TYPE.CSM2_DEF]: {
    label: 'Join now',
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalJoinCsm02,
  },
  [OPERATOR_TYPE.CSM_ICS]: {
    label: `Create ${OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_ICS].short} operator`,
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalCreateIcs,
  },
  [OPERATOR_TYPE.CSM_IDVTC]: {
    label: `Create ${OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_IDVTC].short} operator`,
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalCreateIdvtc,
  },
};

const APPLY_PRESENTATION: Record<ApplicableOperatorType, Presentation> = {
  [OPERATOR_TYPE.CSM_ICS]: {
    label: `Apply for ${OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_ICS].short}`,
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalApplyIcs,
  },
  [OPERATOR_TYPE.CSM_IDVTC]: {
    label: `Apply for ${OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_IDVTC].short}`,
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalApplyIdvtc,
  },
};

const APPLY_PATH_BY_TYPE: Record<ApplicableOperatorType, PATH> = {
  [OPERATOR_TYPE.CSM_ICS]: PATH.TYPE_ICS_APPLY,
  [OPERATOR_TYPE.CSM_IDVTC]: PATH.TYPE_IDVTC_APPLY,
};

const toVisibleType = (option: CreateOption): VisibleType => {
  switch (option.kind) {
    case 'create':
      return {
        type: option.type,
        href: CREATE_PATH_BY_TYPE[option.type],
        primary: true,
        ...CREATE_PRESENTATION[option.type],
      };
    case 'apply':
      return {
        type: option.type,
        href: APPLY_PATH_BY_TYPE[option.type],
        primary: false,
        ...APPLY_PRESENTATION[option.type],
      };
  }
};

export const useVisibleTypes = (): VisibleType[] => {
  const options = useCreateOptions();

  return useMemo(() => options.map(toVisibleType), [options]);
};
