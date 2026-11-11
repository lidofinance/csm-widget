import {
  Counter,
  SegmentedControlCard,
  type SegmentCardItem,
} from '@lidofinance/lido-app-ui';
import { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useInvalidKeysCount } from 'shared/counters';
import { useDeleteMode } from './delete-mode-provider';
import { DeleteMode, isDeleteMode } from './resolve-delete-mode';

// lib stacks below count * 216px, which wraps 3 cards in a ~650px column
const SegmentedControlCardStyled = styled(SegmentedControlCard)`
  && {
    --local-stack-at: 480px;
  }
`;

const ITEMS: Record<DeleteMode, (invalid: number) => SegmentCardItem> = {
  remove: (invalid) => ({
    value: 'remove',
    title:
      invalid > 0 ? (
        <>
          Remove <Counter variant="error">{invalid}</Counter>
        </>
      ) : (
        'Remove'
      ),
    description: 'Only keys that have not been deposited to yet can be removed',
    dataTestId: { root: 'deleteKeysCard' },
  }),
  exit: () => ({
    value: 'exit',
    title: 'Exit',
    description:
      'Only keys that have been active for at least 256 epochs can be exited from the Consensus Layer',
    dataTestId: { root: 'deleteKeysCard' },
  }),
  eject: () => ({
    value: 'eject',
    title: 'Eject',
    tag: 'Emergency',
    description:
      'Only keys that have been active for at least 256 epochs can be ejected using triggerable withdrawals',
    dataTestId: { root: 'deleteKeysCard' },
  }),
};

type DeleteModeCardsProps = { focusOnMount?: boolean };

export const DeleteModeCards: FC<DeleteModeCardsProps> = ({ focusOnMount }) => {
  const { mode, modes, setMode, userSwitched } = useDeleteMode();
  const invalid = useInvalidKeysCount();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusOnMount && userSwitched.current) {
      ref.current
        ?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
        ?.focus();
      userSwitched.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref}>
      <SegmentedControlCardStyled
        aria-label="Deletion option"
        items={modes.map((m) => ITEMS[m](invalid))}
        value={mode ?? ''}
        onChange={(v) => isDeleteMode(v) && setMode(v)}
      />
    </div>
  );
};
