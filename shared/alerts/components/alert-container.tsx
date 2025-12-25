import { DarkThemeProvider } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useAlertActions } from '../alert-provider';
import { AlertContainerStyled } from './styles';

export const AlertContainer: FC = () => {
  const { alerts } = useAlertActions();

  return (
    <DarkThemeProvider>
      <AlertContainerStyled>
        {alerts.map((alert) => (
          <alert.component {...alert.props} key={alert.session} />
        ))}
      </AlertContainerStyled>
    </DarkThemeProvider>
  );
};
