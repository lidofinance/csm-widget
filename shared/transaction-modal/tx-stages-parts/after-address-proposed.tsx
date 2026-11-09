import { Address } from '@lidofinance/lido-app-ui';
import { WIDGET_TITLE } from 'consts/module';
import { FC } from 'react';
import { useModuleMeta } from 'shared/hooks/use-module-meta';
import { WhatsNextBlock } from './whats-next-block';

type Props = {
  address: string;
};

export const AfterAddressProposed: FC<Props> = ({ address }) => {
  const meta = useModuleMeta();

  return (
    <WhatsNextBlock>
      <li>
        Connect to {meta?.shortTitle ?? WIDGET_TITLE} UI with the proposed
        address
        <div>
          <Address address={address} symbols={6} identicon={20} />
        </div>
      </li>
      <li>Go to Settings tab → Inbox requests to confirm the change</li>
    </WhatsNextBlock>
  );
};
