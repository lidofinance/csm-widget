import {
  getOperatorTypeByCurveId,
  MODULE_NAME,
  OPERATOR_TYPE,
  SUPPORTED_CHAINS,
} from '@lidofinance/lido-csm-sdk';

// UI-only classification for curve ids not owned by any gate; the SDK enum
// contains real operator types only.
export const CUSTOM_CURVE = 'CC' as const;
export type DisplayOperatorType = OPERATOR_TYPE | typeof CUSTOM_CURVE;

export type OperatorTypeMetadata = {
  name: string;
  short: string;
  title: string;
  description: string;
  descriptionNote?: { lead: string; rest: string };
  capitalMultiplier?: string;
};

export const OPERATOR_TYPE_METADATA: Record<
  DisplayOperatorType,
  OperatorTypeMetadata
> = {
  [OPERATOR_TYPE.CSM_DEF]: {
    name: 'CSM 0x01',
    short: '0x01',
    title: 'CSM 0x01',
    description:
      'The simplest way to start validating in CSM. Upload keys under the general parameters without any permission or verification. At any point in the future, you may apply to become an Identified Community Staker to access more favorable parameters.',
    capitalMultiplier: 'up to 1.75x',
  },
  [OPERATOR_TYPE.CSM2_DEF]: {
    name: 'CSM 0x02',
    short: '0x02',
    title: 'CSM 0x02',
    description:
      'Unlock the power of 0x02 withdrawal credentials to run validators with balances of up to 2048 ETH.',
    descriptionNote: {
      lead: 'Run 0x02 alongside any other type ',
      rest: '(0x01, ICS, or IDVTC) to stack their benefits.',
    },
    capitalMultiplier: 'up to 2.6x',
  },
  [OPERATOR_TYPE.CSM_LEA]: {
    name: 'Legacy Early Adopter',
    short: 'LEA',
    title: 'Legacy Early Adopter (LEA)',
    description:
      'Legacy early adopter operator type recognizing early participants in the Community Staking Module',
  },
  [OPERATOR_TYPE.CSM_ICS]: {
    name: 'Identified Community Staker',
    short: 'ICS',
    title: 'Identified Community Staker (ICS)',
    description:
      'Access enhanced validation parameters by becoming a recognized independent Community Staker. Please note that the assessment process takes time and requires qualifying under certain categories.',
    capitalMultiplier: 'up to 2.36x',
  },
  [OPERATOR_TYPE.CSM_IDVTC]: {
    name: 'Identified DVT Cluster',
    short: 'IDVTC',
    title: 'Identified DVT Cluster (IDVTC)',
    description:
      'Unlock a more resilient and capital-efficient validation path by creating a verified DVT cluster of independent Community Stakers. Approval requires meeting criteria and completing verification.',
    capitalMultiplier: 'up to 3x',
  },
  [OPERATOR_TYPE.CM_PTO]: {
    name: 'Professional Trusted Operator',
    short: 'PTO',
    title: 'Professional Trusted Operator (PTO)',
    description:
      'This type represents professional operators with a proven track record of strong performance, operational reliability, and ongoing adherence to the Lido protocol standards',
  },
  [OPERATOR_TYPE.CM_PO]: {
    name: 'Professional Operator',
    short: 'PO',
    title: 'Professional Operator (PO)',
    description:
      'This type serves as an initial stage in the validation journey of professional staking organizations, entering the Lido protocol validation as part of the Curated Module v2',
  },
  [OPERATOR_TYPE.CM_PGO]: {
    name: 'Public Good Operator',
    short: 'PGO',
    title: 'Public Good Operator (PGO)',
    description:
      'This type acknowledges entities that strengthen the Ethereum ecosystem through client development, their financial support, or contributing to the broader public infrastructure',
  },
  [OPERATOR_TYPE.CM_DO]: {
    name: 'Decentralization Operator',
    short: 'DO',
    title: 'Decentralization Operator (DO)',
    description:
      'This type recognizes entities that advance Ethereum decentralization by operating nodes in underrepresented regions or running unique client and infrastructure combinations',
  },
  [OPERATOR_TYPE.CM_EEO]: {
    name: 'Extra Effort Operator',
    short: 'EEO',
    title: 'Extra Effort Operator (EEO)',
    description:
      'This type is for entities that demonstrate strong alignment with the Lido protocol through impactful contributions, such as governance participation and stVaults adoption',
  },
  [OPERATOR_TYPE.CM_IODC]: {
    name: 'Intra-Operator DVT Cluster',
    short: 'IODC',
    title: 'Intra-Operator DVT Cluster (IODC)',
    description:
      'This type is designed for distributed validator clusters operated by a single entity, leveraging DVT to enhance validator security, redundancy, and operational reliability',
  },
  [OPERATOR_TYPE.CM_IODCP]: {
    name: 'Intra-Operator DVT Cluster Plus',
    short: 'IODC+',
    title: 'Intra-Operator DVT Cluster Plus (IODC+)',
    description:
      'This type is designed for distributed validator clusters operated by a single entity, leveraging DVT to enhance validator security, redundancy, and operational reliability',
  },
  [CUSTOM_CURVE]: {
    name: 'Custom Curve',
    short: 'CC',
    title: 'Custom Curve (CC)',
    description: 'Custom Curve',
  },
};

// Classify a curve id for display: gate-owned curves resolve to their
// operator type, any other defined curve id is a Custom Curve.
export const getDisplayOperatorType = (
  chainId: SUPPORTED_CHAINS,
  moduleName: MODULE_NAME,
  curveId: bigint | undefined,
): DisplayOperatorType | undefined => {
  if (curveId === undefined) return undefined;
  return (
    getOperatorTypeByCurveId(chainId, { curveId, module: moduleName }) ??
    CUSTOM_CURVE
  );
};

// For components prefer the hooks from shared/hooks (useCurveMetadata et al.);
// this pure variant is for non-reactive contexts like tx-stage callbacks.
export const getCurveMetadata = (
  chainId: SUPPORTED_CHAINS,
  moduleName: MODULE_NAME,
  curveId: bigint | undefined,
) => {
  const operatorType = getDisplayOperatorType(chainId, moduleName, curveId);
  return operatorType ? OPERATOR_TYPE_METADATA[operatorType] : undefined;
};
