export enum CM_OPERATOR_TYPE {
  PTO = 'PTO',
  PO = 'PO',
  PGO = 'PGO',
  DO = 'DO',
  EEO = 'EEO',
  MODC = 'MODC',
  IODC = 'IODC',
  CC = 'CC',
}

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
    short: 'PTO',
    title: 'Professional Trusted Operator (PTO)',
    description:
      'This type represents professional operators with a proven track record of strong performance, operational reliability, and ongoing adherence to the Lido protocol standards.',
    curveId: 0n,
  },
  [CM_OPERATOR_TYPE.PO]: {
    name: 'Professional Operator',
    short: 'PO',
    title: 'Professional Operator (PO)',
    description:
      'This type serves as an initial stage in the validation journey of professional staking organizations, entering the Lido protocol validation as part of the Curated Module v2.',
    curveId: 1n,
  },
  [CM_OPERATOR_TYPE.PGO]: {
    name: 'Public Good Operator',
    short: 'PGO',
    title: 'Public Good Operator (PGO)',
    description:
      'This type acknowledges entities that strengthen the Ethereum ecosystem through client development, their financial support, or contributing to the broader public infrastructure.',
    curveId: 2n,
  },
  [CM_OPERATOR_TYPE.DO]: {
    name: 'Decentralization Operator',
    short: 'DO',
    title: 'Decentralization Operator (DO)',
    description:
      'This type recognizes entities that advance Ethereum decentralization by operating nodes in underrepresented regions or running unique client and infrastructure combinations.',
    curveId: 3n,
  },
  [CM_OPERATOR_TYPE.EEO]: {
    name: 'Extra Effort Operator',
    short: 'EEO',
    title: 'Extra Effort Operator (EEO)',
    description:
      'This type is for entities that demonstrate strong alignment with the Lido protocol through impactful contributions, such as governance participation and stVaults adoption.',
    curveId: 4n,
  },
  [CM_OPERATOR_TYPE.MODC]: {
    name: 'Multi-Operator DVT Cluster',
    short: 'MODC',
    title: 'Multi-Operator DVT Cluster (MODC)',
    description:
      "This type applies to distributed validator clusters formed by multiple verified, independent entities operating together to strengthen Ethereum's robustness and resilience.",
    curveId: 5n,
  },
  [CM_OPERATOR_TYPE.IODC]: {
    name: 'Intra-Operator DVT Cluster',
    short: 'IODC',
    title: 'Intra-Operator DVT Cluster (IODC)',
    description:
      'This type is designed for distributed validator clusters operated by a single entity, leveraging DVT to enhance validator security, redundancy, and operational reliability.',
    curveId: 6n,
  },
  [CM_OPERATOR_TYPE.CC]: {
    name: 'Custom Curve',
    short: 'CC',
    title: 'Custom Curve (CC)',
    description: 'Custom Curve',
    curveId: undefined,
  },
};

export const getCmOperatorTypeByCurveId = (
  curveId: bigint | undefined,
): CM_OPERATOR_TYPE => {
  return (
    Object.values(CM_OPERATOR_TYPE).find((type) => {
      return CM_OPERATOR_TYPE_METADATA[type].curveId === curveId;
    }) ?? CM_OPERATOR_TYPE.CC
  );
};

export const getCurveMetadata = (curveId: bigint | undefined) => {
  const operatorType = getCmOperatorTypeByCurveId(curveId);
  return CM_OPERATOR_TYPE_METADATA[operatorType];
};
