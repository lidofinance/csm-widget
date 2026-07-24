import { OperatorKey, surveysKeys } from 'modules/surveys-sdk';

export const dkgFilesKey = (op: OperatorKey | undefined) =>
  op ? surveysKeys.path(op, 'files') : surveysKeys.pending('files');
