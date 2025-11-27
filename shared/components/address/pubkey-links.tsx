import { KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { CopyLink } from '../copy-button';
import {
  BeaconchainPubkeyLink,
  MigalabsPubkeyLink,
} from '../external-icon-link';

export const PubkeyLinks: FC<
  Pick<KeyWithStatus, 'pubkey' | 'validatorIndex'>
> = (props) => {
  return (
    <>
      <CopyLink text={props.pubkey} />
      <BeaconchainPubkeyLink {...props} />
      <MigalabsPubkeyLink {...props} />
    </>
  );
};
