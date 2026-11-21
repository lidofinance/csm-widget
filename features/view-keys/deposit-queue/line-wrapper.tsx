import { FC, PropsWithChildren } from 'react';
import { useGraphInteraction } from './hover-provider';
import s from './style.module.css';

type Props = { farAway: boolean };

export const LineWrapper: FC<PropsWithChildren<Props>> = ({
  children,
  farAway,
}) => {
  const { setFullView } = useGraphInteraction();
  return (
    <div className={s.wrapper} onMouseLeave={() => setFullView(false)}>
      <div
        className={s.far}
        hidden={!farAway}
        onMouseEnter={() => setFullView(true)}
      />
      {children}
    </div>
  );
};
