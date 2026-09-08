import { createContext, FC, PropsWithChildren, useContext } from 'react';
import type { CreatableOperatorType } from 'shared/hooks';

const CreateTypeContext = createContext<CreatableOperatorType | undefined>(
  undefined,
);

/** Type being created on a /create/<type> page; `undefined` elsewhere. */
export const CreateTypeProvider: FC<
  PropsWithChildren<{ type: CreatableOperatorType }>
> = ({ type, children }) => (
  <CreateTypeContext.Provider value={type}>
    {children}
  </CreateTypeContext.Provider>
);

export const useCreateType = () => useContext(CreateTypeContext);
