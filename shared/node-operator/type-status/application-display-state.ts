import type { OperatorTypeStatus } from 'modules/web3';
import type { ApplicationStatus } from './types';

export type ApplicationDisplayApplication =
  'pending' | 'rejected' | 'approved' | 'approvedClaimed';

export type ApplicationDisplayType =
  | 'pending'
  | 'issued'
  | 'claimed'
  | 'proofUsed'
  | 'proofUsedElsewhere'
  | 'issuedNotOwner'
  | 'ownerIssued'
  | 'otherIssued';

export type ApplicationDisplayCta = 'claim' | 'create' | 'viewDetails';

export type ApplicationDisplayState = {
  application?: ApplicationDisplayApplication;
  type?: ApplicationDisplayType;
  cta?: ApplicationDisplayCta;
};

type Params = {
  formStatus: ApplicationStatus | undefined;
  typeStatus: OperatorTypeStatus;
  hasOperator: boolean;
};

const TYPE_BY_STATUS: Partial<
  Record<OperatorTypeStatus, ApplicationDisplayType>
> = {
  ISSUED: 'issued',
  CLAIMED: 'claimed',
  PROOF_USED: 'proofUsed',
  PROOF_USED_ELSEWHERE: 'proofUsedElsewhere',
  ISSUED_NOT_OWNER: 'issuedNotOwner',
  OWNER_ISSUED: 'ownerIssued',
  OTHER_ISSUED: 'otherIssued',
};

const getApplication = (
  formStatus: ApplicationStatus | undefined,
  typeStatus: OperatorTypeStatus,
): ApplicationDisplayApplication | undefined => {
  switch (formStatus) {
    case 'REVIEW':
      return 'pending';
    case 'REJECTED':
      return 'rejected';
    case 'APPROVED':
      return typeStatus === 'CLAIMED' ? 'approvedClaimed' : 'approved';
    default:
      return undefined;
  }
};

export const getApplicationDisplayState = ({
  formStatus,
  typeStatus,
  hasOperator,
}: Params): ApplicationDisplayState => {
  const application = getApplication(formStatus, typeStatus);
  const type =
    typeStatus === 'PENDING'
      ? formStatus === 'APPROVED'
        ? 'pending'
        : undefined
      : TYPE_BY_STATUS[typeStatus];

  if (!application && !type) return {};

  const cta =
    typeStatus === 'ISSUED'
      ? hasOperator
        ? 'claim'
        : 'create'
      : 'viewDetails';

  return { application, type, cta };
};
