import { Banner, Button, IconUserPlus } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { useInvites } from 'modules/web3';
import { FC } from 'react';
import { IconCircle } from 'shared/components';
import { getIncomingRequestsCopy } from './incoming-requests-copy';

export const IncomingRequestsBanner: FC = () => {
  const { data: invites } = useInvites();
  const copy = getIncomingRequestsCopy(invites ?? []);

  if (!copy) return null;

  // TODO: use info variant (like MessageBox variant="info") once app-ui Banner supports color/variant
  return (
    <Banner
      icon={
        <IconCircle>
          <IconUserPlus />
        </IconCircle>
      }
      title="New address role proposed"
      description={copy}
      action={
        <Button
          href={PATH.SETTINGS_INBOX}
          size="small"
          dataTestId={{ root: 'incomingRequestsBannerButton' }}
        >
          View
        </Button>
      }
      dataTestId={{ root: 'incomingRequestsBanner' }}
    />
  );
};
