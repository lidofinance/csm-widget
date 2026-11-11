import { FC } from 'react';
import { useAlertActions } from '../alert-provider';
import { AlertContainerStyled } from './styles';

type AlertContainerProps = {
  wide?: boolean;
};

export const AlertContainer: FC<AlertContainerProps> = ({ wide }) => {
  const { alerts } = useAlertActions();

  return (
    <AlertContainerStyled $wide={wide}>
      {alerts.map((alert) => (
        <alert.component {...alert.props} key={alert.session} />
      ))}
    </AlertContainerStyled>
  );
};
