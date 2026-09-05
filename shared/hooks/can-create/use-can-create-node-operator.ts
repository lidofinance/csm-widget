import { useCanCreate0x01 } from './use-can-create-0x01';
import { useCanCreate0x02 } from './use-can-create-0x02';
import { useCanCreateCM } from './use-can-create-cm';
import { useCanCreateICS } from './use-can-create-ics';
import { useCanCreateIDVTC } from './use-can-create-idvtc';

export const useCanCreateNodeOperator = () => {
  const checks = [
    useCanCreateCM(),
    useCanCreate0x01(),
    useCanCreate0x02(),
    useCanCreateICS(),
    useCanCreateIDVTC(),
  ];
  return {
    canCreate: checks.some(({ canCreate }) => canCreate),
    isPending: checks.some(({ isPending }) => isPending),
  };
};
