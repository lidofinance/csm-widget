import { useEffect } from 'react';
import { AlertComponentType, useAlertActions } from './alert-provider';

type UseAlertWatcherOptions<P extends object> = {
  /** Alert component to show */
  component: AlertComponentType<P>;
  /** Whether the alert should be shown */
  shouldShow: boolean;
  /** Props to pass to the alert component */
  props?: P;
  /** If true, skip showing/closing until loading completes */
  loading?: boolean;
};

/**
 * Watches a condition and shows/closes an alert accordingly
 */
export const useAlertWatcher = <P extends object = Record<string, never>>({
  component,
  shouldShow,
  props,
  loading = false,
}: UseAlertWatcherOptions<P>) => {
  const { showAlert, closeAlert } = useAlertActions();

  useEffect(() => {
    if (loading) return;

    if (shouldShow) {
      showAlert(component, props);
    } else {
      closeAlert(component);
    }
  }, [shouldShow, component, props, loading, showAlert, closeAlert]);
};
