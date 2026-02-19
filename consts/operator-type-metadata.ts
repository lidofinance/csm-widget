import {
  CM_OPERATOR_TYPE,
  CM_OPERATOR_TYPE_CURVE_ID,
  CSM_OPERATOR_TYPE,
  CSM_OPERATOR_TYPE_CURVE_ID,
  getOperatorTypeByCurveId,
  MODULE_NAME,
  type OperatorType,
} from '@lidofinance/lido-csm-sdk';
import { config } from 'config';
import { MODULE } from './module';

type OperatorTypeMetadata = {
  name: string;
  short: string;
  title: string;
  description: string;
  curveId: bigint | undefined;
};

export const CM_OPERATOR_TYPE_METADATA: Record<
  CM_OPERATOR_TYPE,
  OperatorTypeMetadata
> = {
  [CM_OPERATOR_TYPE.PTO]: {
    name: 'Professional Trusted Operator',
    short: CM_OPERATOR_TYPE.PTO,
    title: 'Professional Trusted Operator (PTO)',
    description:
      'This type represents professional operators with a proven track record of strong performance, operational reliability, and ongoing adherence to the Lido protocol standards.',
    curveId: CM_OPERATOR_TYPE_CURVE_ID[CM_OPERATOR_TYPE.PTO],
  },
  [CM_OPERATOR_TYPE.PO]: {
    name: 'Professional Operator',
    short: CM_OPERATOR_TYPE.PO,
    title: 'Professional Operator (PO)',
    description:
      'This type serves as an initial stage in the validation journey of professional staking organizations, entering the Lido protocol validation as part of the Curated Module v2.',
    curveId: CM_OPERATOR_TYPE_CURVE_ID[CM_OPERATOR_TYPE.PO],
  },
  [CM_OPERATOR_TYPE.PGO]: {
    name: 'Public Good Operator',
    short: CM_OPERATOR_TYPE.PGO,
    title: 'Public Good Operator (PGO)',
    description:
      'This type acknowledges entities that strengthen the Ethereum ecosystem through client development, their financial support, or contributing to the broader public infrastructure.',
    curveId: CM_OPERATOR_TYPE_CURVE_ID[CM_OPERATOR_TYPE.PGO],
  },
  [CM_OPERATOR_TYPE.DO]: {
    name: 'Decentralization Operator',
    short: CM_OPERATOR_TYPE.DO,
    title: 'Decentralization Operator (DO)',
    description:
      'This type recognizes entities that advance Ethereum decentralization by operating nodes in underrepresented regions or running unique client and infrastructure combinations.',
    curveId: CM_OPERATOR_TYPE_CURVE_ID[CM_OPERATOR_TYPE.DO],
  },
  [CM_OPERATOR_TYPE.EEO]: {
    name: 'Extra Effort Operator',
    short: CM_OPERATOR_TYPE.EEO,
    title: 'Extra Effort Operator (EEO)',
    description:
      'This type is for entities that demonstrate strong alignment with the Lido protocol through impactful contributions, such as governance participation and stVaults adoption.',
    curveId: CM_OPERATOR_TYPE_CURVE_ID[CM_OPERATOR_TYPE.EEO],
  },
  [CM_OPERATOR_TYPE.MODC]: {
    name: 'Multi-Operator DVT Cluster',
    short: CM_OPERATOR_TYPE.MODC,
    title: 'Multi-Operator DVT Cluster (MODC)',
    description:
      "This type applies to distributed validator clusters formed by multiple verified, independent entities operating together to strengthen Ethereum's robustness and resilience.",
    curveId: CM_OPERATOR_TYPE_CURVE_ID[CM_OPERATOR_TYPE.MODC],
  },
  [CM_OPERATOR_TYPE.IODC]: {
    name: 'Intra-Operator DVT Cluster',
    short: CM_OPERATOR_TYPE.IODC,
    title: 'Intra-Operator DVT Cluster (IODC)',
    description:
      'This type is designed for distributed validator clusters operated by a single entity, leveraging DVT to enhance validator security, redundancy, and operational reliability.',
    curveId: CM_OPERATOR_TYPE_CURVE_ID[CM_OPERATOR_TYPE.IODC],
  },
  [CM_OPERATOR_TYPE.CC]: {
    name: 'Custom Curve',
    short: CM_OPERATOR_TYPE.CC,
    title: 'Custom Curve (CC)',
    description: 'Custom Curve',
    curveId: CM_OPERATOR_TYPE_CURVE_ID[CM_OPERATOR_TYPE.CC],
  },
};

export const CSM_OPERATOR_TYPE_METADATA: Record<
  CSM_OPERATOR_TYPE,
  OperatorTypeMetadata
> = {
  [CSM_OPERATOR_TYPE.DEF]: {
    name: 'Default',
    short: CSM_OPERATOR_TYPE.DEF,
    title: 'Default (DEF)',
    description:
      'The simplest way to start validating in CSM. Upload keys under the general parameters without any permission or verification. At any point in the future, you may apply to become an Identified Community Staker to access more favorable parameters',
    curveId: CSM_OPERATOR_TYPE_CURVE_ID[CSM_OPERATOR_TYPE.DEF],
  },
  [CSM_OPERATOR_TYPE.LEA]: {
    name: 'Legacy Early Adopter',
    short: CSM_OPERATOR_TYPE.LEA,
    title: 'Legacy Early Adopter (LEA)',
    description:
      'Legacy early adopter operator type recognizing early participants in the Community Staking Module.',
    curveId: CSM_OPERATOR_TYPE_CURVE_ID[CSM_OPERATOR_TYPE.LEA],
  },
  [CSM_OPERATOR_TYPE.ICS]: {
    name: 'Identified Community Staker',
    short: CSM_OPERATOR_TYPE.ICS,
    title: 'Identified Community Staker (ICS)',
    description:
      'Obtain enhanced validation parameters by becoming recognized as an independent Community Staker. Please note that the verification process takes time and requires the submission of specific supporting proofs',
    curveId: CSM_OPERATOR_TYPE_CURVE_ID[CSM_OPERATOR_TYPE.ICS],
  },
  [CSM_OPERATOR_TYPE.CC]: {
    name: 'Custom Curve',
    short: CSM_OPERATOR_TYPE.CC,
    title: 'Custom Curve (CC)',
    description: 'Custom Curve',
    curveId: CSM_OPERATOR_TYPE_CURVE_ID[CSM_OPERATOR_TYPE.CC],
  },
};

export const sdkModuleName: MODULE_NAME =
  config.module === MODULE.CM ? MODULE_NAME.CM : MODULE_NAME.CSM;

export const OPERATOR_TYPE_METADATA: Record<
  OperatorType,
  OperatorTypeMetadata
> = {
  ...CSM_OPERATOR_TYPE_METADATA,
  ...CM_OPERATOR_TYPE_METADATA,
};

export const getOperatorTypeForCurveId = (
  curveId: bigint | undefined,
): OperatorType => {
  if (curveId === undefined) {
    return sdkModuleName === MODULE_NAME.CM
      ? CM_OPERATOR_TYPE.CC
      : CSM_OPERATOR_TYPE.CC;
  }
  return getOperatorTypeByCurveId(sdkModuleName as MODULE_NAME.CSM, curveId);
};

export const getCurveMetadata = (curveId: bigint | undefined) => {
  const operatorType = getOperatorTypeForCurveId(curveId);
  return OPERATOR_TYPE_METADATA[operatorType];
};
