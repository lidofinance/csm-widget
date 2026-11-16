import { Input, InputProps, getFieldLabelId } from '@lidofinance/lido-app-ui';
import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
  useId,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

const TrailingSlotStyle = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
`;

export type TrailingInputProps = InputProps & {
  /** Interactive content after the input; kept out of the lib's aria-hidden icon slot. */
  trailing?: ReactNode;
};

const assignRef = <T,>(ref: ForwardedRef<T>, node: T | null) => {
  if (typeof ref === 'function') ref(node);
  else if (ref) ref.current = node;
};

// app-ui Input has no suffix slot and aria-hides `icon`, so trailing is portaled into the label
export const TrailingInput = forwardRef<HTMLInputElement, TrailingInputProps>(
  ({ trailing, ...props }, ref) => {
    const fallbackId = useId();
    const id = props.id ?? fallbackId;
    const labelledBy =
      props.label != null && !props['aria-label'] && !props['aria-labelledby']
        ? getFieldLabelId(id)
        : props['aria-labelledby'];
    const [host, setHost] = useState<HTMLElement | null>(null);

    const setRef = useCallback(
      (node: HTMLInputElement | null) => {
        assignRef(ref, node);
        setHost(node?.closest('label') ?? null);
      },
      [ref],
    );

    return (
      <>
        <Input {...props} id={id} aria-labelledby={labelledBy} ref={setRef} />
        {trailing
          ? host
            ? createPortal(
                <TrailingSlotStyle>{trailing}</TrailingSlotStyle>,
                host,
              )
            : trailing
          : null}
      </>
    );
  },
);
TrailingInput.displayName = 'TrailingInput';
