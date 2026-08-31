import { ToastContainer as StyledToastContainer } from '@lidofinance/lido-ui';
import { ComponentProps, FC } from 'react';

type Props = ComponentProps<typeof StyledToastContainer>;

type LegacyDefaults = {
  defaultProps?: Props;
  strippedDefaultProps?: Props;
};

// react-toastify@7 (pinned by lido-ui) declares static defaultProps, which React 18.3 warns
// about on mount. Strip them and pass them back as real props — they hold non-exported
// `transition`/`closeButton` values, and stashing them on the component keeps them across a
// Fast Refresh re-run of this module.
const { target } = StyledToastContainer as unknown as {
  target: LegacyDefaults;
};

if (target.defaultProps) {
  target.strippedDefaultProps = target.defaultProps;
  delete target.defaultProps;
}

export const ToastContainer: FC = () => (
  <StyledToastContainer {...target.strippedDefaultProps} />
);
