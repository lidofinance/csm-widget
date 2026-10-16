import { v4 as uuid } from 'uuid';

export type Alerts = {
  component: React.ComponentType<any>;
  props: any;
  session: string;
}[];

type AlertComponent = Alerts[number]['component'];

export const upsertAlert = (
  prev: Alerts,
  component: AlertComponent,
  props: unknown,
): Alerts => {
  const index = prev.findIndex((alert) => alert.component === component);
  if (index === -1) return [...prev, { component, props, session: uuid() }];
  if (prev[index].props === props) return prev;
  return prev.with(index, { ...prev[index], props });
};

export const removeAlert = (
  prev: Alerts,
  component?: AlertComponent,
): Alerts => {
  const next = prev.filter((alert) => alert.component !== component);
  return next.length === prev.length ? prev : next;
};
