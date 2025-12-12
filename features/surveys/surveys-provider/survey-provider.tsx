import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { useNodeOperator } from 'modules/web3';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import invariant from 'tiny-invariant';
import { useDelegatedOperators } from './use-delegated-operators';

export type SurveyMode =
  | { type: 'loading' }
  | { type: 'operator'; operatorId: NodeOperatorId }
  | { type: 'delegator'; delegatedOperators: string[] }
  | { type: 'empty' };

export type SurveyContextValue = {
  mode: SurveyMode;
  isLoading: boolean;
  isOperator: boolean;
  delegatedOperators: string[];
};

const SurveyContext = createContext<SurveyContextValue | null>(null);

export const useSurveyContext = (): SurveyContextValue => {
  const value = useContext(SurveyContext);
  invariant(value, 'useSurveyContext must be used within SurveyProvider');
  return value;
};

export const SurveysProvider: FC<PropsWithChildren> = ({ children }) => {
  const { nodeOperator, isPending: operatorPending } = useNodeOperator();
  const { data: delegatedOperators, isLoading: delegatorLoading } =
    useDelegatedOperators(nodeOperator?.id);

  const isLoading = operatorPending || delegatorLoading;
  const isOperator = !!nodeOperator;

  const mode = useMemo((): SurveyMode => {
    if (isLoading) return { type: 'loading' };
    if (nodeOperator) return { type: 'operator', operatorId: nodeOperator.id };
    if (delegatedOperators?.length)
      return { type: 'delegator', delegatedOperators };
    return { type: 'empty' };
  }, [isLoading, nodeOperator, delegatedOperators]);

  const value: SurveyContextValue = {
    mode,
    isLoading,
    isOperator,
    delegatedOperators: delegatedOperators ?? [],
  };

  return (
    <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>
  );
};
