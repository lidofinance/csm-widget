import { Component } from 'types';

export type SwitchItemComponent = Component<'a'>;

export type SwitchRoutes = {
  name: string;
  path: string;
}[];

// TODO: generic type
export type SwitchProps = {
  routes: SwitchRoutes;
  active: number;
};
