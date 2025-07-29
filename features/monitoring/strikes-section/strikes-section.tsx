import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { useNodeOperatorId, useOperatorKeysWithStatus } from 'modules/web3';
import { FC } from 'react';
import {
  BeaconchainPubkeyLink,
  CopyLink,
  EthseerPubkeyLink,
  KeyStrikes,
  Pubkey,
  SectionBlock,
  Stack,
} from 'shared/components';
import { hasStatus } from 'utils';
import { List, Row } from './styles';
import { LastStrike } from './last-strike';

type WithStrikes = KeyWithStatus & Required<Pick<KeyWithStatus, 'strikes'>>;

export const StrikesSection: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: _keys } = useOperatorKeysWithStatus(nodeOperatorId);

  const keys =
    (_keys?.filter(hasStatus([KEY_STATUS.WITH_STRIKES])) as WithStrikes[]) ??
    [];

  if (keys.length === 0) return null;

  return (
    <SectionBlock title="Keys with Strikes">
      <Stack direction="column">
        <Text size="xs" color="secondary">
          Strikes are issued for bad performance. In case your key gets 3
          strikes within 6 frames the key will be ejected.
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
