import {
  FormLayout,
  type FormLayoutProps,
  Stack,
} from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import {
  FORM_SKELETON_PROPS,
  FormAsideSkeletonContent,
  FormMainSkeletonContent,
} from 'shared/form-page/form-ready';
import { DeleteModeCards } from './delete-mode-cards';
import s from './delete-keys-layout.module.css';
import { EmptyAside } from './empty-aside';

export type DeleteKeysLayoutProps = FormLayoutProps & {
  focusCards?: boolean;
};

export const DeleteKeysLayout: FC<DeleteKeysLayoutProps> = ({
  aside,
  focusCards,
  children,
  ...rest
}) => (
  <div className={s.root}>
    <FormLayout aside={aside ?? <EmptyAside />} {...rest}>
      <Stack direction="column" gap={32}>
        <DeleteModeCards focusOnMount={focusCards} />
        {children}
      </Stack>
    </FormLayout>
  </div>
);

export const DeleteKeysFormSkeleton: FC = () => (
  <DeleteKeysLayout
    {...FORM_SKELETON_PROPS}
    aside={<FormAsideSkeletonContent />}
  >
    <FormMainSkeletonContent />
  </DeleteKeysLayout>
);
