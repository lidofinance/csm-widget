import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import invariant from 'tiny-invariant';
import { useDepositQueueModule } from './hooks/use-deposit-queue-module';
import { GraphPart } from './types';

export type GraphInteractionContextType = {
  hover?: GraphPart;
  setHover: (hover?: GraphPart) => void;
  fullView: boolean;
  setFullView: (fullView: boolean) => void;
  module: MODULE_NAME;
};

const GraphInteractionContext = createContext<GraphInteractionContextType>(
  {} as GraphInteractionContextType,
);

export const GraphInteractionProvider: FC<
  PropsWithChildren<{ module?: MODULE_NAME }>
> = ({ module, children }) => {
  const [hover, setHover] = useState<GraphPart>();
  const [fullView, setFullView] = useState(false);
  const resolvedModule = useDepositQueueModule(module);

  return (
    <GraphInteractionContext.Provider
      value={{ hover, setHover, fullView, setFullView, module: resolvedModule }}
    >
      {children}
    </GraphInteractionContext.Provider>
  );
};

export const useGraphInteraction = () => {
  const value = useContext(GraphInteractionContext);
  invariant(value, 'useGraphInteraction was used outside the provider');
  return value;
};
