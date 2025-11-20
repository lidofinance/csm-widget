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
      {data.map(({ pubkey, strikes, validatorIndex }) => (
        <Row key={pubkey}>
          <Pubkey
            pubkey={pubkey}
            link={<PubkeyLinks {...{ pubkey, validatorIndex }} />}
          />
          <KeyStrikes strikes={strikes} />
          <LastStrike strikes={strikes} />
        </Row>
      ))}
    </List>
  );
};
