import { ROLE_CODE } from 'consts/roles';
import { PATH } from 'consts/urls';

export type SwitchRoutes = {
  title: string;
  path: PATH;
  roles?: ROLE_CODE[];
}[];

export type SwitchProps = {
  routes: SwitchRoutes;
  active?: number;
};
