import {
  MessageBox,
  SectionTitle,
  Stack,
  Typography,
} from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { LIDO_RESEARCH_FORUM_NODE_OPERATORS_LINK } from 'consts/external-links';
import { DeleteKeysLayout } from 'features/delete-keys/delete-keys-layout';
import { MatomoLink } from 'shared/components';
import { useModuleMeta } from 'shared/hooks';
import { Gate } from 'shared/navigate';

const GUIDES_URL =
  'https://docs.lido.fi/run-on-lido/csm/lido-csm-widget/exiting-csm-validators/exit-using-validator-keystores';

const GUIDES = [
  ['Dappnode', 'dappnode', MATOMO_CLICK_EVENTS_TYPES.exitKeysDappnodeLink],
  ['Sedge', 'sedge', MATOMO_CLICK_EVENTS_TYPES.exitKeysSedgeLink],
  ['Stereum', 'stereum', MATOMO_CLICK_EVENTS_TYPES.exitKeysStereumLink],
  ['EthPillar', 'ethpillar', MATOMO_CLICK_EVENTS_TYPES.exitKeysEthpillarLink],
  ['EthDocker', 'eth-docker', MATOMO_CLICK_EVENTS_TYPES.exitKeysEthdockerLink],
  ['Systemd', 'systemd', MATOMO_CLICK_EVENTS_TYPES.exitKeysSystemdLink],
] as const;

export const ExitKeys: FC = () => {
  const meta = useModuleMeta();

  return (
    <DeleteKeysLayout focusCards>
      <Stack direction="column" gap={16}>
        <Gate rule="IS_CSM_FAMILY">
          <SectionTitle title="Follow the instructions" />
          <Typography variant="body" color="secondary">
            Sign and broadcast an exit message for each validator key you want
            to exit using one of the guides below:
          </Typography>
          <Stack direction="row" wrap gap={16}>
            {GUIDES.map(([label, anchor, matomoEvent]) => (
              <MatomoLink
                key={anchor}
                icon="external"
                href={`${GUIDES_URL}#${anchor}`}
                matomoEvent={matomoEvent}
              >
                {label}
              </MatomoLink>
            ))}
          </Stack>
        </Gate>
        <Gate rule="IS_CM">
          <MessageBox variant="warning">
            Out of order exits are discouraged by{' '}
            <MatomoLink
              $inline
              href="https://ipfs.io/ipfs/QmW9kE61zC61PcuikCQRwn82aoTCj9yPuENGNPML9QLkSM"
            >
              the Validator Exits Standard Node Operator Protocol (SNOP)
            </MatomoLink>
            . In case an out of order exit is required, the Node Operator must
            notify the community, specifying the number of validators affected,
            their indices, and the reason for the exit request via{' '}
            <MatomoLink $inline href={LIDO_RESEARCH_FORUM_NODE_OPERATORS_LINK}>
              the Node Operator category of the Lido Research Forum
            </MatomoLink>
            .
          </MessageBox>
        </Gate>
        <MessageBox>
          This action should be performed outside the{' '}
          {meta?.shortName ?? 'module'} UI
        </MessageBox>
      </Stack>
    </DeleteKeysLayout>
  );
};
