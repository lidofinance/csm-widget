import { KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { KeyStrikes, Pubkey, PubkeyLinks } from 'shared/components';
import { useTable } from 'providers/table-provider';
import { LastStrike } from './last-strike';
import { List, Row } from './styles';

type WithStrikes = KeyWithStatus & Required<Pick<KeyWithStatus, 'strikes'>>;

export const StrikesTable: FC = () => {
  const { data } = useTable<WithStrikes>();

  return (
    <List>
      {data.map((key) => (
        <Row key={key.pubkey}>
          <Pubkey pubkey={key.pubkey} link={<PubkeyLinks {...key} />} />
          <KeyStrikes strikes={key.strikes} />
          <LastStrike strikes={key.strikes} />
        </Row>
      ))}
    </List>
  );
};
