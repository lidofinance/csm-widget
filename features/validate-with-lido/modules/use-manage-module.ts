import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { useCallback, useMemo } from 'react';
import { useAvailableOperators, useNodeOperator } from 'modules/web3';
import { useSwitchOperator } from 'shared/node-operator';

export const useManageModule = (modules: MODULE_NAME[]) => {
  const { data: list } = useAvailableOperators();
  const { requestSelection } = useNodeOperator();
  const switchOperator = useSwitchOperator(PATH.HOME);

  const operators = useMemo(
    () => list?.filter((item) => modules.includes(item.module)) ?? [],
    [list, modules],
  );

  const manage = useCallback(() => {
    if (operators.length === 1) {
      switchOperator(operators[0]);
    } else {
      requestSelection(modules);
    }
  }, [operators, modules, switchOperator, requestSelection]);

  return { hasOperators: operators.length > 0, manage };
};
