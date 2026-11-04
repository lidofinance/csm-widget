import { Address } from '@lidofinance/lido-app-ui';
import { Text } from '@lidofinance/lido-ui';
import { WIDGET_TITLE } from 'consts/module';
import { FC } from 'react';
import { Address as LegacyAddress } from 'shared/components';
import { useFormUi } from 'shared/hook-form/form-ui';
import { useModuleMeta } from 'shared/hooks/use-module-meta';
import { WhatsNextBlock } from './whats-next-block';

type Props = {
  address: string;
};

export const AfterAddressProposed: FC<Props> = ({ address }) => {
  const meta = useModuleMeta();
  const ui = useFormUi();

  return (
    <WhatsNextBlock>
      <li>
        Connect to {meta?.shortTitle ?? WIDGET_TITLE} UI with the proposed
        address
        {ui === 'app' ? (
          <div>
            <Address address={address} symbols={6} identicon={20} />
          </div>
        ) : (
          <Text size="xxs">
            <LegacyAddress address={address} showIcon />
          </Text>
        )}
      </li>
      <li>Go to Settings tab → Inbox requests to confirm the change</li>
    </WhatsNextBlock>
  );
};
