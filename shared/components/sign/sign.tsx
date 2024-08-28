import { FC } from 'react';
import { SignStyle } from './style';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { ReactComponent as MinusIcon } from 'assets/icons/minus.svg';

export const Sign: FC<{ minus?: boolean }> = ({ minus }) => (
  <SignStyle>{minus ? <MinusIcon /> : <PlusIcon />}</SignStyle>
);
