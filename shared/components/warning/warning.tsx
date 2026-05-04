import { ReactComponent as AlertIcon } from 'assets/icons/alert.svg';
import { FC } from 'react';
import { WarningTextStyle } from './style';

// TODO: drop
export const Warning: FC<{ text: string }> = ({ text }) => (
  <WarningTextStyle>
    <AlertIcon />
    {text}
  </WarningTextStyle>
);
