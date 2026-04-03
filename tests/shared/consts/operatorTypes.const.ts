import {
  OPERATOR_TYPE,
  OPERATOR_TYPE_CURVE_ID,
} from '@lidofinance/lido-csm-sdk';

type OperatorTypeMetadata = {
  name: string;
  short: string;
  title: string;
  description: string;
  curveId: bigint | undefined;
};

export const OPERATOR_TYPE_METADATA: Record<
  OPERATOR_TYPE,
  OperatorTypeMetadata
> = {
  [OPERATOR_TYPE.CSM_DEF]: {
    name: 'Default',
    short: 'DEF',
    title: 'Default (DEF)',
    description:
      'The simplest way to start validating in CSM. Upload keys under the general parameters without any permission or verification. At any point in the future, you may apply to become an Identified Community Staker to access more favorable parameters',
    curveId: OPERATOR_TYPE_CURVE_ID.CSM_DEF,
  },
  [OPERATOR_TYPE.CSM_LEA]: {
    name: 'Legacy Early Adopter',
    short: 'LEA',
    title: 'Legacy Early Adopter (LEA)',
    description:
      'Legacy early adopter operator type recognizing early participants in the Community Staking Module.',
    curveId: OPERATOR_TYPE_CURVE_ID.CSM_LEA,
  },
  [OPERATOR_TYPE.CSM_ICS]: {
    name: 'Identified Community Staker',
    short: 'ICS',
    title: 'Identified Community Staker (ICS)',
    description:
      'Obtain enhanced validation parameters by becoming recognized as an independent Community Staker. Please note that the verification process takes time and requires the submission of specific supporting proofs',
    curveId: OPERATOR_TYPE_CURVE_ID.CSM_ICS,
  },
  [OPERATOR_TYPE.CM_PTO]: {
    name: 'Professional Trusted Operator',
    short: 'PTO',
    title: 'Professional Trusted Operator (PTO)',
    description:
      'This type represents professional operators with a proven track record of strong performance, operational reliability, and ongoing adherence to the Lido protocol standards.',
    curveId: OPERATOR_TYPE_CURVE_ID.CM_PTO,
  },
  [OPERATOR_TYPE.CM_PO]: {
    name: 'Professional Operator',
    short: 'PO',
    title: 'Professional Operator (PO)',
    description:
      'This type serves as an initial stage in the validation journey of professional staking organizations, entering the Lido protocol validation as part of the Curated Module v2.',
    curveId: OPERATOR_TYPE_CURVE_ID.CM_PO,
  },
  [OPERATOR_TYPE.CM_PGO]: {
    name: 'Public Good Operator',
    short: 'PGO',
    title: 'Public Good Operator (PGO)',
    description:
      'This type acknowledges entities that strengthen the Ethereum ecosystem through client development, their financial support, or contributing to the broader public infrastructure.',
    curveId: OPERATOR_TYPE_CURVE_ID.CM_PGO,
  },
  [OPERATOR_TYPE.CM_DO]: {
    name: 'Decentralization Operator',
    short: 'DO',
    title: 'Decentralization Operator (DO)',
    description:
      'This type recognizes entities that advance Ethereum decentralization by operating nodes in underrepresented regions or running unique client and infrastructure combinations.',
    curveId: OPERATOR_TYPE_CURVE_ID.CM_DO,
  },
  [OPERATOR_TYPE.CM_MODC]: {
    name: 'Multi-Operator DVT Cluster',
    short: 'MODC',
    title: 'Multi-Operator DVT Cluster (MODC)',
    description:
      "This type applies to distributed validator clusters formed by multiple verified, independent entities operating together to strengthen Ethereum's robustness and resilience.",
    curveId: OPERATOR_TYPE_CURVE_ID.CM_MODC,
  },
  [OPERATOR_TYPE.CM_IODC]: {
    name: 'Intra-Operator DVT Cluster',
    short: 'IODC',
    title: 'Intra-Operator DVT Cluster (IODC)',
    description:
      'This type is designed for distributed validator clusters operated by a single entity, leveraging DVT to enhance validator security, redundancy, and operational reliability.',
    curveId: OPERATOR_TYPE_CURVE_ID.CM_IODC,
  },
  [OPERATOR_TYPE.CC]: {
    name: 'Custom Curve',
    short: 'CC',
    title: 'Custom Curve (CC)',
    description: 'Custom Curve',
    curveId: OPERATOR_TYPE_CURVE_ID.CC,
  },
};
