import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { CREATE_PATH_BY_TYPE } from 'consts/urls';
import { useCanCreateNodeOperator } from './use-can-create-node-operator';

export type CreatableOperatorType = keyof typeof CREATE_PATH_BY_TYPE;
export type ApplicableOperatorType =
  OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC;

export type CreateOption =
  | { type: CreatableOperatorType; kind: 'create' }
  | { type: ApplicableOperatorType; kind: 'apply' };

export const useCreateOptions = (): CreateOption[] =>
  useCanCreateNodeOperator().createOptions;
