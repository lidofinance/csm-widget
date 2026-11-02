import { FC, RefCallback } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { RefCallBack } from 'react-hook-form';
import {
  FOCUSABLE_SELECTOR,
  Focusable,
  toFocusable,
  useFocusableRef,
} from './use-focusable-ref';

const makeRoot = (inner: { focus: jest.Mock } | null) => {
  const root = {
    focus: jest.fn(),
    querySelector: jest.fn(() => inner),
  };
  return root as unknown as HTMLElement & typeof root;
};

describe('toFocusable', () => {
  it('focuses the first focusable descendant', () => {
    const inner = { focus: jest.fn() };
    const root = makeRoot(inner);

    toFocusable(root).focus();

    expect(root.querySelector).toHaveBeenCalledWith(FOCUSABLE_SELECTOR);
    expect(inner.focus).toHaveBeenCalledTimes(1);
    expect(root.focus).not.toHaveBeenCalled();
  });

  it('falls back to the wrapper when nothing inside is focusable', () => {
    const root = makeRoot(null);

    toFocusable(root).focus();

    expect(root.focus).toHaveBeenCalledTimes(1);
  });

  it('looks the target up on every focus call', () => {
    const root = makeRoot({ focus: jest.fn() });
    const focusable = toFocusable(root);

    focusable.focus();
    focusable.focus();

    expect(root.querySelector).toHaveBeenCalledTimes(2);
  });

  it('skips disabled, hidden and tabindex=-1 elements', () => {
    expect(FOCUSABLE_SELECTOR).toContain('input:not([disabled])');
    expect(FOCUSABLE_SELECTOR).toContain(':not([type="hidden"])');
    expect(FOCUSABLE_SELECTOR).toContain(':not([tabindex="-1"])');
  });
});

describe('toFocusable with a selector', () => {
  it('focuses the first match of the given selector', () => {
    const inner = { focus: jest.fn() };
    const root = makeRoot(inner);

    toFocusable(root, 'textarea').focus();

    expect(root.querySelector).toHaveBeenCalledWith('textarea');
    expect(inner.focus).toHaveBeenCalledTimes(1);
  });
});

describe('useFocusableRef', () => {
  let captured: RefCallback<HTMLElement> | undefined;
  const Probe: FC<{ fieldRef: RefCallBack }> = ({ fieldRef }) => {
    captured = useFocusableRef(fieldRef);
    return null;
  };

  it('registers a focusable for the wrapper with the RHF ref', () => {
    const fieldRef = jest.fn();
    renderToStaticMarkup(<Probe fieldRef={fieldRef} />);
    const inner = { focus: jest.fn() };

    captured?.(makeRoot(inner));

    expect(fieldRef).toHaveBeenCalledTimes(1);
    const registered = fieldRef.mock.calls[0][0] as Focusable;
    registered.focus();
    expect(inner.focus).toHaveBeenCalledTimes(1);
  });

  it('passes the selector through to the registered focusable', () => {
    const fieldRef = jest.fn();
    let withSelector: RefCallback<HTMLElement> | undefined;
    const SelectorProbe: FC = () => {
      withSelector = useFocusableRef(fieldRef, '[role="radio"][tabindex="0"]');
      return null;
    };
    renderToStaticMarkup(<SelectorProbe />);
    const root = makeRoot({ focus: jest.fn() });

    withSelector?.(root);
    (fieldRef.mock.calls[0][0] as Focusable).focus();

    expect(root.querySelector).toHaveBeenCalledWith(
      '[role="radio"][tabindex="0"]',
    );
  });

  it('forwards null on unmount', () => {
    const fieldRef = jest.fn();
    renderToStaticMarkup(<Probe fieldRef={fieldRef} />);

    captured?.(null);

    expect(fieldRef).toHaveBeenCalledWith(null);
  });
});
