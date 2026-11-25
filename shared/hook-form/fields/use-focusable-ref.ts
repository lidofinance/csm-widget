import { RefCallback, useCallback } from 'react';
import type { RefCallBack } from 'react-hook-form';

export type Focusable = { focus: () => void };

export const FOCUSABLE_SELECTOR = [
  'input',
  'textarea',
  'select',
  'button',
  'a[href]',
  '[tabindex]',
]
  .map(
    (tag) => `${tag}:not([disabled]):not([type="hidden"]):not([tabindex="-1"])`,
  )
  .join(', ');

// Resolved on every call: tabs and disclosures swap the inner DOM after mount
export const toFocusable = (
  root: HTMLElement,
  selector = FOCUSABLE_SELECTOR,
): Focusable => ({
  focus: () => (root.querySelector<HTMLElement>(selector) ?? root).focus(),
});

/** Ref for a wrapper of a control without a forwarded ref, so RHF `shouldFocusError` can focus it. */
export const useFocusableRef = (
  fieldRef: RefCallBack,
  selector?: string,
): RefCallback<HTMLElement> =>
  useCallback(
    (el: HTMLElement | null) => fieldRef(el && toFocusable(el, selector)),
    [fieldRef, selector],
  );
