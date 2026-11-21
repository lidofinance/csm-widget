import { FC } from 'react';
import { getKeysConfirmItems, KeysConfirmInput } from '../add-keys-state';
import s from '../styles.module.css';

export const KeysConfirmLines: FC<KeysConfirmInput> = (props) => (
  <>
    I confirm that:
    {getKeysConfirmItems(props).map((item) => (
      <span key={item} className={s.confirmLine}>
        {item}
      </span>
    ))}
  </>
);
