import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { useNodeOperatorId, useOperatorKeysWithStatus } from 'modules/web3';
import { FC } from 'react';
import {
  BeaconchainPubkeyLink,
  CopyLink,
  EthseerPubkeyLink,
  FaqStrikeLifetime,
  FaqStrikeThreshold,
  KeyStrikes,
  Pubkey,
  SectionBlock,
  Stack,
} from 'shared/components';
import { hasStatus } from 'utils';
import { LastStrike } from './last-strike';
import { List, Row } from './styles';

type WithStrikes = KeyWithStatus & Required<Pick<KeyWithStatus, 'strikes'>>;

export const StrikesSection: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: _keys } = useOperatorKeysWithStatus(nodeOperatorId);

  const keys = (_keys || [])
    .filter(hasStatus(KEY_STATUS.WITH_STRIKES))
    .filter(
      hasStatus([KEY_STATUS.ACTIVE, KEY_STATUS.ACTIVATION_PENDING]),
    ) as WithStrikes[];

  if (keys.length === 0) return null;

  return (
    <SectionBlock title="Keys with Strikes">
      <Stack direction="column">
        <Text size="xs" color="secondary">
          Strikes are issued for bad performance. In case your key gets{' '}
          <FaqStrikeThreshold /> within <FaqStrikeLifetime /> the key will be
          ejected.
        </Text>
        <List>
          {keys.map(({ pubkey, strikes, validatorIndex }) => (
            <Row key={pubkey}>
              <Pubkey
                pubkey={pubkey}
                link={
                  <>
                    <CopyLink text={pubkey} />
                    <BeaconchainPubkeyLink pubkey={pubkey} />
                    <EthseerPubkeyLink validator={validatorIndex} />
                  </>
                }
              />
              <KeyStrikes strikes={strikes} />
              <LastStrike strikes={strikes} />
            </Row>
          ))}
        </List>
      </Stack>
    </SectionBlock>
  );
};
