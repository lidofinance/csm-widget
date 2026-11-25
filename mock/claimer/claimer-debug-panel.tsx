import { PATH } from 'consts/urls';
import { FC } from 'react';
import { Card, Description, Stack } from '@lidofinance/lido-app-ui';
import { ShowRule, useShowFlags } from 'shared/hooks';
import { useNavItems } from 'shared/layout/navigation/use-nav-items';
import { getCorrectPath } from 'shared/navigate/get-correct-path';
import s from './claimer-debug-panel.module.css';

const FLAGS: ShowRule[] = [
  'IS_CONNECTED_WALLET',
  'HAS_MANAGER_ROLE',
  'HAS_REWARDS_ROLE',
  'HAS_CLAIMER_ROLE',
  'IS_NODE_OPERATOR',
  'HAS_ANY_ROLE',
  'NOT_NODE_OPERATOR',
];

// Expected resolution for a claimer-only wallet.
const PATHS: [PATH, PATH][] = [
  [PATH.BOND, PATH.BOND_CLAIM],
  [PATH.BOND_CLAIM, PATH.BOND_CLAIM],
  [PATH.BOND_ADD, PATH.BOND_CLAIM],
  [PATH.BOND_UNLOCK, PATH.BOND_CLAIM],
  [PATH.KEYS, PATH.CREATE],
  [PATH.KEYS_DELETE, PATH.CREATE],
  [PATH.SETTINGS, PATH.SETTINGS_INBOX],
];

const EXPECTED_NAV = ['Dashboard', 'Create Operator', 'Bond & Rewards'];

export const ClaimerDebugPanel: FC = () => {
  const flags = useShowFlags();
  const nav = useNavItems().map((r) => r.name);

  return (
    <Card>
      <Stack direction="column" gap={16}>
        <Description color="secondary">Show flags</Description>
        {FLAGS.map((f) => (
          <div className={s.row} key={f}>
            <span>{f}</span>
            <span>{String(flags[f])}</span>
          </div>
        ))}
        <Description color="secondary">
          getCorrectPath (expected for claimer-only)
        </Description>
        {PATHS.map(([from, expected]) => {
          const actual = getCorrectPath(from, flags);
          return (
            <div className={s.row} key={from}>
              <span>{from}</span>
              <span className={s.ok} data-ok={actual === expected}>
                {actual} {actual === expected ? '✓' : `✗ expected ${expected}`}
              </span>
            </div>
          );
        })}
        <Description color="secondary">Nav items</Description>
        <div className={s.row}>
          <span>{nav.join(', ') || '—'}</span>
          <span
            className={s.ok}
            data-ok={nav.every((n) => EXPECTED_NAV.includes(n))}
          >
            {nav.every((n) => EXPECTED_NAV.includes(n))
              ? '✓ subset of expected'
              : '✗ unexpected item'}
          </span>
        </div>
      </Stack>
    </Card>
  );
};
