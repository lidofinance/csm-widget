import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { FC, PropsWithChildren } from 'react';
import { SiweAuthContext } from 'modules/siwe/siwe-auth-context';
import type { SiweAuthContextType } from 'modules/siwe/types';
import {
  NodeOperatorContext,
  NodeOperatorContextValue,
} from 'modules/web3/operator-provider/node-operator-provider';
import type { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { MOCK_OPERATOR_ID } from './data';

// The members components read data via props, so no query-cache seeding is
// needed. Two contexts must exist for render, though: SIWE auth (mutation
// hooks call useSiweAuth unconditionally) and the node operator (ownership
// message generation). Submissions on the stand hit the real surveys API with
// this fake token and fail with the error stage — that is expected.
const mockSiweAuth: SiweAuthContextType = {
  token: 'test-token',
  signIn: async () => {},
  authenticate: async () => 'test-token',
  logout: () => {},
  handleAuthError: () => {},
};

const mockNodeOperator: NodeOperatorContextValue = {
  isPending: false,
  needsSelection: false,
  nodeOperator: {
    nodeOperatorId: MOCK_OPERATOR_ID,
    module: MODULE_NAME.CSM,
  } as ModuleNodeOperator,
  activeModule: MODULE_NAME.CSM,
  switchNodeOperator: () => {},
};

export const MockMembersProvider: FC<PropsWithChildren> = ({ children }) => (
  <SiweAuthContext.Provider value={mockSiweAuth}>
    <NodeOperatorContext.Provider value={mockNodeOperator}>
      {children}
    </NodeOperatorContext.Provider>
  </SiweAuthContext.Provider>
);
