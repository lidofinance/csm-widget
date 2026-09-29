import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useAvailableOperators, useDappStatus } from 'modules/web3';
import { hasOperatorRole } from 'modules/web3/operator-provider/has-operator-role';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { useMemo } from 'react';

const MODULE_ORDER: MODULE_NAME[] = [
  MODULE_NAME.CSM,
  MODULE_NAME.CSM_02,
  MODULE_NAME.CM,
];

const byModuleThenId = (a: ModuleNodeOperator, b: ModuleNodeOperator) =>
  MODULE_ORDER.indexOf(a.module) - MODULE_ORDER.indexOf(b.module) ||
  Number(a.nodeOperatorId - b.nodeOperatorId);

/** Operators where the wallet is manager or rewards address; claimer-only entries excluded. */
export const useMyOperators = () => {
  const { address } = useDappStatus();
  const { data: list, isPending } = useAvailableOperators();

  const data = useMemo(
    () =>
      list?.filter((op) => hasOperatorRole(op, address)).sort(byModuleThenId),
    [list, address],
  );

  return { data, isPending };
};
