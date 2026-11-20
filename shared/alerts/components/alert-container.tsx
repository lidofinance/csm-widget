import { FC } from 'react';
import { useAlertActions } from '../alert-provider';
import s from './alert-container.module.css';

type AlertContainerProps = {
  wide?: boolean;
};

export const AlertContainer: FC<AlertContainerProps> = ({ wide }) => {
  const { alerts } = useAlertActions();

  return (
    <div className={s.root} data-wide={wide || undefined}>
      {alerts.map((alert) => (
        <alert.component {...alert.props} key={alert.session} />
      ))}
    </div>
  );
};
