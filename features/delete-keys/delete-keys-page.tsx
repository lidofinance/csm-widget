import { Fragment, ComponentProps, FC } from 'react';
import { useFaq } from 'faq';

import { PATH } from 'consts/urls';
import { EjectKeysForm } from 'features/eject-keys/eject-keys/eject-keys-form';
import { ExitKeys } from 'features/exit-keys/exit-keys';
import { RemoveKeysForm } from 'features/remove-keys/remove-keys/remove-keys-form';
import { Faq } from 'shared/components';
import { useWeb3Key } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { SplashPage } from 'shared/navigate';
import { DeleteModeProvider, useDeleteMode } from './delete-mode-provider';
import { DeleteMode } from './resolve-delete-mode';

const PAGE_NAME: Record<DeleteMode, ComponentProps<typeof Layout>['pageName']> =
  {
    remove: 'RemoveKeys',
    exit: 'ExitKeys',
    eject: 'EjectKeys',
  };

const DELETE_CRUMBS = [{ label: 'Keys', href: PATH.KEYS }, { label: 'Delete' }];

const DeleteKeysContent: FC = () => {
  const { mode } = useDeleteMode();
  const key = useWeb3Key();
  const faq = useFaq('KEYS');

  if (!mode) return <SplashPage />;

  return (
    <Layout wide pageName={PAGE_NAME[mode]} breadcrumbs={DELETE_CRUMBS}>
      <Fragment key={key}>
        {mode === 'remove' && <RemoveKeysForm />}
        {mode === 'exit' && <ExitKeys />}
        {mode === 'eject' && <EjectKeysForm />}
      </Fragment>
      <Faq items={faq} />
    </Layout>
  );
};

export const DeleteKeysPage: FC = () => (
  <DeleteModeProvider>
    <DeleteKeysContent />
  </DeleteModeProvider>
);
