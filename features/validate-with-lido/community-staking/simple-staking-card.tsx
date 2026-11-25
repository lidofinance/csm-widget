import {
  Divider,
  Grid,
  GridItem,
  IconArrowRight,
  SectionTitle,
  Stack,
  TextLink,
  Typography,
} from '@lidofinance/lido-app-ui';
import { CSM_NODE_SETUP_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { AvatarStack } from 'shared/components';
import { trackMatomoEvent } from 'utils';
import allnodes from 'assets/partners/simple-staking/allnodes.svg';
import beaconchain from 'assets/partners/simple-staking/beaconchain.svg';
import launchnodes from 'assets/partners/simple-staking/launchnodes.svg';
import migalabs from 'assets/partners/simple-staking/migalabs.svg';
import obol from 'assets/partners/simple-staking/obol.svg';
import rated from 'assets/partners/simple-staking/rated.svg';
import ssv from 'assets/partners/simple-staking/ssv.svg';
import stakely from 'assets/partners/simple-staking/stakely.svg';
import { PromoCard } from '../components';
import { LOW_CODE_PARTNERS } from './low-code-partners';
import { PartnerAvatar } from './partner-avatar';

type Partner = { name: string; src: string; href: string };

type Block = {
  title: string;
  description: string;
  partners: Partner[];
};

const BLOCKS: Block[] = [
  {
    title: 'Low/no-code Integrations',
    description:
      'Use Plug & Play solutions for a smoother validator node setup experience',
    partners: LOW_CODE_PARTNERS,
  },
  {
    title: 'Run with DVTs',
    description: 'Collaborate with peers to run CSM validators through DVTs',
    partners: [
      { name: 'Obol', src: obol, href: 'https://obol.org' },
      { name: 'SSV', src: ssv, href: 'https://ssv.network' },
    ],
  },
  {
    title: 'Validator as a Service',
    description:
      'Participate in the network via VaaS without needing to bootstrap or maintain a validator node',
    partners: [
      { name: 'Allnodes', src: allnodes, href: 'https://www.allnodes.com' },
      {
        name: 'Launchnodes',
        src: launchnodes,
        href: 'https://www.launchnodes.com',
      },
      { name: 'Stakely', src: stakely, href: 'https://stakely.io' },
    ],
  },
  {
    title: 'Performance Tracking',
    description: 'Access real-time insights into validator performance',
    partners: [
      { name: 'beaconcha.in', src: beaconchain, href: 'https://beaconcha.in' },
      { name: 'MigaLabs', src: migalabs, href: 'https://migalabs.io' },
      { name: 'Rated', src: rated, href: 'https://www.rated.network' },
    ],
  },
];

const BlockView: FC<{ block: Block }> = ({ block }) => (
  <Stack direction="column" gap={8} align="start">
    <AvatarStack size={24}>
      {block.partners.map(({ name, src, href }) => (
        <PartnerAvatar key={name} name={name} src={src} href={href} />
      ))}
    </AvatarStack>
    <Stack direction="column" gap={0}>
      <Typography variant="bodyLarge" weight="semibold">
        {block.title}
      </Typography>
      <Typography variant="description" color="secondary">
        {block.description}
      </Typography>
    </Stack>
  </Stack>
);

export const SimpleStakingCard: FC = () => {
  return (
    <PromoCard>
      <Stack direction="column" gap={24} align="stretch">
        <SectionTitle
          title="Simple Staking with CSM"
          titleAs="h3"
          action={
            <TextLink
              href={CSM_NODE_SETUP_LINK}
              icon={<IconArrowRight width={20} height={20} />}
              onClick={() =>
                trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.csmViewDetails)
              }
            >
              View details
            </TextLink>
          }
        />
        <Grid columns={2} columnGap={32} rowGap={24}>
          <BlockView block={BLOCKS[0]} />
          <BlockView block={BLOCKS[1]} />
          <GridItem span="full">
            <Divider />
          </GridItem>
          <BlockView block={BLOCKS[2]} />
          <BlockView block={BLOCKS[3]} />
        </Grid>
      </Stack>
    </PromoCard>
  );
};
