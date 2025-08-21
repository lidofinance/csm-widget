import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import invariant from 'tiny-invariant';
import { GraphPart } from './types';

export type GraphInteractionContextType = {
  hover?: GraphPart;
  setHover: (hover?: GraphPart) => void;
  fullView: boolean;
  setFullView: (fullView: boolean) => void;
};

const GraphInteractionContext = createContext<GraphInteractionContextType>(
  {} as GraphInteractionContextType,
);

export const GraphInteractionProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [hover, setHover] = useState<GraphPart>();
  const [fullView, setFullView] = useState(false);

  return (
    <GraphInteractionContext.Provider
      value={{ hover, setHover, fullView, setFullView }}
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
