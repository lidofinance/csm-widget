import {
  createContext,
  FC,
  memo,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import invariant from 'tiny-invariant';
import { Alerts, removeAlert, upsertAlert } from './alerts-state';

type EmptyObj = Record<string, never>;
export type AlertProps<P extends object = EmptyObj> = P; // {} & P
export type AlertComponentType<P extends object = EmptyObj> = React.FC<
  AlertProps<P>
>;

export type AlertContextValue = {
  showAlert: <P extends object>(
    component: AlertComponentType<P>,
    props?: P,
  ) => void;
  closeAlert: <P extends object>(component?: AlertComponentType<P>) => void;
  alerts: Alerts;
};
export const AlertContext = createContext<AlertContextValue | null>(null);

export const useAlertActions = () => {
  const value = useContext(AlertContext);
  invariant(value, 'seAlertActions was used outside the AlertContext provider');
  return value;
};

const AlertProviderRaw: FC<PropsWithChildren> = ({ children }) => {
  const [alertsState, setAlertsState] = useState<Alerts>([]);

  const showAlert: AlertContextValue['showAlert'] = useCallback(
    (component, props) => {
      setAlertsState((prev) => upsertAlert(prev, component, props));
    },
    [],
  );

  const closeAlert: AlertContextValue['closeAlert'] = useCallback(
    (component) => {
      setAlertsState((prev) => removeAlert(prev, component));
    },
    [],
  );

  const context = useMemo(
    () => ({
      showAlert,
      closeAlert,
      alerts: alertsState,
    }),
    [showAlert, closeAlert, alertsState],
  );

  return (
    <AlertContext.Provider value={context}>{children}</AlertContext.Provider>
  );
};

export const AlertProvider = memo(AlertProviderRaw);
