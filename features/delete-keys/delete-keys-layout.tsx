import {
  FormLayout,
  type FormLayoutProps,
  Stack,
} from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import styled from 'styled-components';
import {
  FORM_SKELETON_PROPS,
  FormAsideSkeletonContent,
  FormMainSkeletonContent,
} from 'shared/form-page/form-ready';
import { DeleteModeCards } from './delete-mode-cards';
import { EmptyAside } from './empty-aside';

// an empty stacked aside would leave a padded band; stylis 0.8 can't emit @container rules
const Wrapper = styled.div`
  aside:has([data-testid='emptyAside']) {
    padding: 0;
    border-top: none;
  }
`;

export type DeleteKeysLayoutProps = FormLayoutProps & {
  focusCards?: boolean;
};

export const DeleteKeysLayout: FC<DeleteKeysLayoutProps> = ({
  aside,
  focusCards,
  children,
  ...rest
}) => (
  <Wrapper>
    <FormLayout aside={aside ?? <EmptyAside />} {...rest}>
      <Stack direction="column" gap={32}>
        <DeleteModeCards focusOnMount={focusCards} />
        {children}
      </Stack>
    </FormLayout>
  </Wrapper>
);

export const DeleteKeysFormSkeleton: FC = () => (
  <DeleteKeysLayout
    {...FORM_SKELETON_PROPS}
    aside={<FormAsideSkeletonContent />}
  >
    <FormMainSkeletonContent />
  </DeleteKeysLayout>
);
