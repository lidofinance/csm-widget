import { Callout } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { useInvites } from 'modules/web3';
import { FC } from 'react';
import { getIncomingRequestsCopy } from './incoming-requests-copy';

export const IncomingRequestsBanner: FC = () => {
  const { data: invites } = useInvites();
  const copy = getIncomingRequestsCopy(invites ?? []);

  if (!copy) return null;

  return (
    <Callout
      tone="info"
      rounded
      href={PATH.SETTINGS_INBOX}
      dataTestId={{ root: 'incomingRequestsBanner' }}
    >
      {copy}
    </Callout>
  );
};
