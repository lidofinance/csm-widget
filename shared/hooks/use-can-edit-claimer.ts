import { useShowFlags } from './use-show-rule';

export const useCanEditClaimer = (): boolean => {
  const { HAS_OWNER_ROLE } = useShowFlags();

  return HAS_OWNER_ROLE;
};
