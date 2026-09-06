import { Block, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { ShowRule, useShowFlags } from 'shared/hooks';
import { useNavItems } from 'shared/layout/navigation/use-nav-items';
import { getCorrectPath } from 'shared/navigate/get-correct-path';
import styled from 'styled-components';

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  font-family: monospace;
  font-size: 12px;
`;

const Ok = styled.span<{ $ok: boolean }>`
  color: ${({ $ok }) => ($ok ? 'var(--lido-color-success)' : 'var(--lido-color-error)')};
`;

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
  [PATH.BOND_ADD, PATH.BOND_ADD],
  [PATH.BOND_UNLOCK, PATH.BOND_UNLOCK],
  [PATH.KEYS, PATH.KEYS_VIEW],
  [PATH.KEYS_VIEW, PATH.KEYS_VIEW],
  [PATH.SETTINGS, PATH.SETTINGS_ROLES],
];

const EXPECTED_NAV = [
  'Dashboard',
  'Create Operator',
  'Keys',
  'Monitoring',
  'Bond & Rewards',
  'Settings',
];

export const ClaimerDebugPanel: FC = () => {
  const flags = useShowFlags();
  const nav = useNavItems().map((r) => r.name);

  return (
    <Block>
      <Stack direction="column" gap="md">
        <Text size="xs" color="secondary">
          Show flags
        </Text>
        {FLAGS.map((f) => (
          <Row key={f}>
            <span>{f}</span>
            <span>{String(flags[f])}</span>
          </Row>
        ))}
        <Text size="xs" color="secondary">
          getCorrectPath (expected for claimer-only)
        </Text>
        {PATHS.map(([from, expected]) => {
          const actual = getCorrectPath(from, flags);
          return (
            <Row key={from}>
              <span>{from}</span>
              <Ok $ok={actual === expected}>
                {actual} {actual === expected ? '✓' : `✗ expected ${expected}`}
              </Ok>
            </Row>
          );
        })}
        <Text size="xs" color="secondary">
          Nav items
        </Text>
        <Row>
          <span>{nav.join(', ') || '—'}</span>
          <Ok $ok={nav.every((n) => EXPECTED_NAV.includes(n))}>
            {nav.every((n) => EXPECTED_NAV.includes(n))
              ? '✓ subset of expected'
              : '✗ unexpected item'}
          </Ok>
        </Row>
      </Stack>
    </Block>
  );
};
