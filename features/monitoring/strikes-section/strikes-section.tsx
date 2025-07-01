import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { Text, Tooltip } from '@lidofinance/lido-ui';
import {
  useCurveParameters,
  useFrameInfo,
  useNodeOperatorId,
  useOperatorCurveId,
  useOperatorKeysWithStatus,
} from 'modules/web3';
import { FC, useCallback } from 'react';
import {
  BeaconchainPubkeyLink,
  CopyLink,
  EthseerPubkeyLink,
  Pubkey,
  SectionBlock,
  Stack,
} from 'shared/components';
import { formatDate, hasStatus } from 'utils';
import { Circle, List, Row } from './styles';

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
              <Strikes strikes={strikes} />
              <LastStrike strikes={strikes} />
            </Row>
          ))}
        </List>
      </Stack>
    </SectionBlock>
  );
};

export const LastStrike: FC<{ strikes: number[] }> = ({ strikes }) => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: curveId } = useOperatorCurveId(nodeOperatorId);
  const { data: params } = useCurveParameters(curveId);
  const { data: info } = useFrameInfo();

  if (!info || !params) return null;

  const n = strikes.findLastIndex((v) => !!v);
  const strikeTimestamp =
    info.lastReport - info.frameDuration * (strikes.length - n - 1);

  return (
    <Text size="xs" color="secondary">
      Last Strike: {formatDate(strikeTimestamp, 'dd.MM.yyyy')}
    </Text>
  );
};

export const Strikes: FC<{ strikes: number[] }> = ({ strikes }) => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: curveId } = useOperatorCurveId(nodeOperatorId);
  const { data: params } = useCurveParameters(curveId);
  const { data: info } = useFrameInfo();

  const getTooltip = useCallback(
    (n: number) => {
      if (!info || !params) return null;
      const strikeTimestamp =
        info.lastReport - info.frameDuration * (strikes.length - n - 1);
      const expireTimestamp =
        strikeTimestamp + params.strikesConfig.lifetime * info.frameDuration;
      return info ? (
        <>
          Received: {formatDate(strikeTimestamp, 'dd.MM.yyyy')}
          <br />
          Expires: {formatDate(expireTimestamp, 'dd.MM.yyyy')}
        </>
      ) : null;
    },
    [info, params, strikes.length],
  );

  return (
    <Stack gap="xs">
      {strikes.map((s, i) => (
        <span key={i}>
          {s ? (
            <Tooltip placement="top" title={getTooltip(i)}>
              <Circle $red />
            </Tooltip>
          ) : (
            <Circle />
          )}
        </span>
      ))}
    </Stack>
  );
};
