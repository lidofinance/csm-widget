import { BOND_DEBT_HELP } from 'consts/text';
import { useModuleMeta, useShowRule } from 'shared/hooks';

export const LOCKED_TOOLTIP_CSM =
  'Penalties have been applied to your Node Operator because of an MEV stealing event reported by a dedicated committee. If it is not covered, the corresponding amount of your bond may be burned. See details in the Locked Bond tab.';

export const LOCKED_TOOLTIP_CM =
  'Penalties have been applied to your Node Operator. If they are not covered, the corresponding amount of your bond may be burned. See details in the Locked Bond tab.';

export const NEGATIVE_FIELDS = ['locked', 'pendingToSplit', 'debt'] as const;

export type NegativeField = (typeof NEGATIVE_FIELDS)[number];

export const useNegativeMetadata = (): Record<
  NegativeField,
  { title: string; tooltip: string }
> => {
  const check = useShowRule();
  const meta = useModuleMeta();

  return {
    locked: {
      title: 'Locked:',
      tooltip: check('IS_CSM_FAMILY') ? LOCKED_TOOLTIP_CSM : LOCKED_TOOLTIP_CM,
    },
    pendingToSplit: {
      title: 'Splitter debt:',
      tooltip: `Is the amount that has not been split due to insufficient bond or locked bond that occurred earlier. When claiming rewards ${meta?.shortName ?? 'the module'} will try to split this amount from excess bond.`,
    },
    debt: { title: 'Bond debt:', tooltip: BOND_DEBT_HELP },
  };
};
