import { OperatorKey, surveysKeys } from 'modules/surveys-sdk';

export const membersBaseKey = (op: OperatorKey | undefined) =>
  op ? surveysKeys.path(op, 'members') : surveysKeys.pending('members');

export const rotationBaseKey = (op: OperatorKey | undefined) =>
  op
    ? surveysKeys.path(op, 'rotation-request')
    : surveysKeys.pending('rotation-request');
