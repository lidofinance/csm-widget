import { Component, NodeOperatorRolesProps } from 'types';

export type SwitchItemComponent = Component<'a'>;

export type SwitchRoutes = {
  title: string;
  path: string;
  roles?: NodeOperatorRolesProps;
}[];

export type SwitchProps = {
  routes: SwitchRoutes;
  active?: number;
};
