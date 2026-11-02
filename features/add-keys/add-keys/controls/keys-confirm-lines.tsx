import { FC } from 'react';
import { getKeysConfirmItems } from '../add-keys-state';
import { ConfirmLineStyle } from '../styles';

type Props = { approaching: boolean; reached: boolean };

export const KeysConfirmLines: FC<Props> = ({ approaching, reached }) => (
  <>
    I confirm that:
    {getKeysConfirmItems({ approaching, reached }).map((item) => (
      <ConfirmLineStyle key={item}>{item}</ConfirmLineStyle>
    ))}
  </>
);
