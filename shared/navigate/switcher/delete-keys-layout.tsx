import {
  Stack,
  FormLayout,
  type FormLayoutProps,
} from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import {
  DeleteKeysSwitcher,
  type DeleteKeysSwitcherRoutes,
} from './delete-keys-switcher';

export type DeleteKeysLayoutProps = FormLayoutProps & {
  active: DeleteKeysSwitcherRoutes;
};

export const DeleteKeysLayout: FC<DeleteKeysLayoutProps> = ({
  active,
  aside,
  children,
  ...rest
}) => (
  <FormLayout aside={aside} {...rest}>
    <Stack direction="column" gap={32}>
      <DeleteKeysSwitcher active={active} />
      {children}
    </Stack>
  </FormLayout>
);
