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
  key: string;
  type?: OPERATOR_TYPE;
  href: PATH;
  label: string;
  matomoEvent: MATOMO_CLICK_EVENTS_TYPES;
  primary: boolean;
};

type Presentation = { label: string; matomoEvent: MATOMO_CLICK_EVENTS_TYPES };

const selectLabel = (type: CreatableOperatorType) =>
  `Select ${OPERATOR_TYPE_METADATA[type].short}`;

const CREATE_PRESENTATION: Record<CreatableOperatorType, Presentation> = {
  [OPERATOR_TYPE.CSM_DEF]: {
    label: selectLabel(OPERATOR_TYPE.CSM_DEF),
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalJoinPermissionless,
  },
  [OPERATOR_TYPE.CSM2_DEF]: {
    label: selectLabel(OPERATOR_TYPE.CSM2_DEF),
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalJoinCsm02,
  },
  [OPERATOR_TYPE.CSM_ICS]: {
    label: selectLabel(OPERATOR_TYPE.CSM_ICS),
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalCreateIcs,
  },
  [OPERATOR_TYPE.CSM_IDVTC]: {
    label: selectLabel(OPERATOR_TYPE.CSM_IDVTC),
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalCreateIdvtc,
  },
};

const APPLY_PRESENTATION: Record<ApplicableOperatorType, Presentation> = {
  [OPERATOR_TYPE.CSM_ICS]: {
    label: 'Learn more',
    matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalApplyIcs,
  },
  [OPERATOR_TYPE.CSM_IDVTC]: {
    label: 'Learn more',
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
        key: option.type,
        type: option.type,
        href: CREATE_PATH_BY_TYPE[option.type],
        primary: true,
        ...CREATE_PRESENTATION[option.type],
      };
    case 'apply':
      return {
        key: option.type,
        type: option.type,
        href: APPLY_PATH_BY_TYPE[option.type],
        primary: false,
        ...APPLY_PRESENTATION[option.type],
      };
    case 'create-cm':
      return {
        key: 'cm',
        href: PATH.CREATE_CM,
        primary: true,
        label: 'Continue',
        matomoEvent: MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalCreateCm,
      };
  }
};

export const useVisibleTypes = (): VisibleType[] => {
  const options = useCreateOptions();

  return useMemo(() => options.map(toVisibleType), [options]);
};
