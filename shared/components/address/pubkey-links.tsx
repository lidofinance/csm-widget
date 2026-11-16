import { KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { Copy } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { notifyCopied } from 'shared/hooks';
import {
  BeaconchainPubkeyLink,
  MigalabsPubkeyLink,
} from '../external-icon-link';

export const PubkeyLinks: FC<
  Pick<KeyWithStatus, 'pubkey' | 'validatorIndex' | 'statuses'>
> = (props) => {
  return (
    <>
      <Copy text={props.pubkey} onCopy={notifyCopied} />
      <BeaconchainPubkeyLink {...props} />
      <MigalabsPubkeyLink {...props} />
    </>
  );
};
