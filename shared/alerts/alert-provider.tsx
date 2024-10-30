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
import { v4 as uuid } from 'uuid';

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
  alerts: {
    component: React.ComponentType<any>;
    props: any;
    session: string;
  }[];
};
export const AlertContext = createContext<AlertContextValue | null>(null);

export const useAlertActions = () => {
  const value = useContext(AlertContext);
  invariant(value, 'seAlertActions was used outside the AlertContext provider');
  return value;
};

const AlertProviderRaw: FC<PropsWithChildren> = ({ children }) => {
  const [alertsState, setAlertsState] = useState<AlertContextValue['alerts']>(
    [],
  );

  const showAlert: AlertContextValue['showAlert'] = useCallback(
    (component, props) => {
      setAlertsState((prev) => {
        const index = prev.findIndex((alert) => alert.component === component);
        return index >= 0
          ? prev.splice(index, 1, {
              component,
              props,
              session: prev[index].session,
            })
          : [...prev, { component, props, session: uuid() }];
      });
    },
    [],
  );

  const closeAlert: AlertContextValue['closeAlert'] = useCallback(
    (component) => {
      setAlertsState((prev) => {
        const index = prev.findIndex((alert) => alert.component === component);
        if (index >= 0) {
          const next = Array.from(prev);
          next.splice(index, 1);
          return next;
        }
        return prev;
      });
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
