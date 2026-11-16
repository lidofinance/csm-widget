import { useMemo } from 'react';
import { useShowRule } from 'shared/hooks';
import { DELETE_MODES, DeleteMode } from './resolve-delete-mode';

export const useDeleteModes = (): DeleteMode[] => {
  const check = useShowRule();
  const canRemove = check('HAS_MANAGER_ROLE');
  const canExit = check('IS_NODE_OPERATOR');
  const canEject = check('HAS_OWNER_ROLE');

  return useMemo(() => {
    const allowed: Record<DeleteMode, boolean> = {
      remove: canRemove,
      exit: canExit,
      eject: canEject,
    };
    return DELETE_MODES.filter((mode) => allowed[mode]);
  }, [canRemove, canExit, canEject]);
};
