import { FC } from 'react';
import { getKeysConfirmItems, KeysConfirmInput } from '../add-keys-state';
import { ConfirmLineStyle } from '../styles';

export const KeysConfirmLines: FC<KeysConfirmInput> = (props) => (
  <>
    I confirm that:
    {getKeysConfirmItems(props).map((item) => (
      <ConfirmLineStyle key={item}>{item}</ConfirmLineStyle>
    ))}
  </>
);
