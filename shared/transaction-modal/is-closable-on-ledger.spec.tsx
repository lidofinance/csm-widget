import { FC } from 'react';
import { getModalCloseProps } from './form-modal-shell';
import {
  ClosableOnLedgerStage,
  isClosableOnLedgerStage,
} from './is-closable-on-ledger';

const Terminal: FC & ClosableOnLedgerStage = () => null;
Terminal.isClosableOnLedger = true;

const Pending: FC = () => null;

describe('Ledger closability', () => {
  it('lets a marked terminal stage close the modal', () => {
    expect(isClosableOnLedgerStage(<Terminal />)).toBe(true);
  });

  it('keeps the modal locked on an unmarked stage', () => {
    expect(isClosableOnLedgerStage(<Pending />)).toBe(false);
  });

  it('keeps it locked for DOM elements and non-elements', () => {
    expect(isClosableOnLedgerStage(<div />)).toBe(false);
    expect(isClosableOnLedgerStage('text')).toBe(false);
    expect(isClosableOnLedgerStage(undefined)).toBe(false);
  });

  it('gives a locked stage no close affordance', () => {
    expect(
      getModalCloseProps(isClosableOnLedgerStage(<Pending />), vi.fn()),
    ).toEqual({
      onClose: undefined,
      closeOnEscape: false,
      closeOnOverlayClick: false,
    });
  });
});
