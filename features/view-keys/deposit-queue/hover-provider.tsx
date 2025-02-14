import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import invariant from 'tiny-invariant';
import { GraphPart } from './types';

export type HoverContextType = {
  hover?: GraphPart;
  setHover: (hover?: GraphPart) => void;
};

const HoverContext = createContext<HoverContextType>({} as HoverContextType);

export const HoverProvider: FC<PropsWithChildren> = ({ children }) => {
  const [hover, setHover] = useState<GraphPart>();

  return (
    <HoverContext.Provider value={{ hover, setHover }}>
      {children}
    </HoverContext.Provider>
  );
};

export const useHover = () => {
  const value = useContext(HoverContext);
  invariant(value, 'useHover was used outside the provider');
  return value;
};
