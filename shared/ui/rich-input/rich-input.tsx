import {
  RichInput as AppRichInput,
  type RichInputProps as AppRichInputProps,
} from '@lidofinance/lido-app-ui';
import type { FC } from 'react';
import { LockedLabelStyle, LockIconStyle } from './styles';

export type { RichInputDataTestId } from '@lidofinance/lido-app-ui';

export type RichInputProps = AppRichInputProps & {
  locked?: boolean;
};

export const RichInput: FC<RichInputProps> = ({
  locked = false,
  label,
  balance,
  showMaxButton = true,
  readOnly,
  ...rest
}) => (
  <AppRichInput
    {...rest}
    label={
      locked && label != null ? (
        <LockedLabelStyle>
          {label}
          <LockIconStyle aria-hidden="true" />
        </LockedLabelStyle>
      ) : (
        label
      )
    }
    balance={locked ? undefined : balance}
    showMaxButton={showMaxButton && !locked}
    readOnly={locked || readOnly}
  />
);
