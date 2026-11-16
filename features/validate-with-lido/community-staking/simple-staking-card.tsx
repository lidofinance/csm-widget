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
import styled from 'styled-components';
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

type Partner = { name: string; src: string };

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
      { name: 'Obol', src: obol },
      { name: 'SSV', src: ssv },
    ],
  },
  {
    title: 'Validator as a Service',
    description:
      'Participate in the network via VaaS without needing to bootstrap or maintain a validator node',
    partners: [
      { name: 'Allnodes', src: allnodes },
      { name: 'Launchnodes', src: launchnodes },
      { name: 'Stakely', src: stakely },
    ],
  },
  {
    title: 'Performance Tracking',
    description: 'Access real-time insights into validator performance',
    partners: [
      { name: 'beaconcha.in', src: beaconchain },
      { name: 'MigaLabs', src: migalabs },
      { name: 'Rated', src: rated },
    ],
  },
];

const Chips = styled.div`
  display: flex;
`;

const Chip = styled.span`
  position: relative;
  overflow: hidden;
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--lido-app-ui-color-background-surface);

  &:not(:last-child) {
    margin-right: -8px;
  }

  img {
    position: absolute;
    inset: 0;
    width: 24px;
    height: 24px;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 1px solid var(--lido-app-ui-color-border-default);
  }
`;

const BlockView: FC<{ block: Block }> = ({ block }) => (
  <Stack direction="column" gap={8} align="start">
    <Chips>
      {block.partners.map(({ name, src }, index) => (
        <Chip key={name} title={name} style={{ zIndex: 100 - index }}>
          <img src={src} alt={name} width={24} height={24} />
        </Chip>
      ))}
    </Chips>
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
