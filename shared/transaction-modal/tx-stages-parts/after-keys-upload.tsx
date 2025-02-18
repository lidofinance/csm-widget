import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { LocalLink } from 'shared/navigate';
import styled from 'styled-components';
import { NodeOperatorId } from 'types';
import Link from 'next/link';

type Props = {
  nodeOperatorId?: NodeOperatorId;
  keys: string[];
};

export const AfterKeysUpload: FC<Props> = () => {
  const { beaconchain } = getExternalLinks();
  return (
    <BlockStyled color="background">
      <b>What is next: </b>
      <br />
      <ol>
        <li>Wait for your keys to be deposited through the protocol. </li>
        <li>
          Once your keys become active (check the status on the{' '}
          <LocalLink
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.createSuccessKeysTab}
            href={PATH.KEYS_VIEW}
          >
            Keys tab
          </LocalLink>
          , on{' '}
          <MatomoLink
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.createSuccessBeaconchain}
            href={beaconchain}
          >
            beaconcha.in
          </MatomoLink>{' '}
          or subscribe to the
          {/* DAPPNODE */}
          <Link href={PATH.NOTIFICATIONS}>CSM Telegram notifications</Link>)
          make sure your validators are producing attestations.
        </li>
      </ol>
    </BlockStyled>
  );
};

const BlockStyled = styled.div`
  text-align: left;
  line-height: 24px;

  background-color: var(--lido-color-backgroundSecondary);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
`;
