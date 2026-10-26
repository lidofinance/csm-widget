import {
  Divider,
  H3,
  IconArrowRight,
  Stack,
  Typography,
} from '@lidofinance/lido-app-ui';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import styled from 'styled-components';
import { useExternalLinks } from 'shared/hooks';
import { trackMatomoEvent } from 'utils';
import allnodes from 'assets/partners/simple-staking/allnodes.svg';
import beaconchain from 'assets/partners/simple-staking/beaconchain.svg';
import dappnode from 'assets/partners/simple-staking/dappnode.svg';
import ethDocker from 'assets/partners/simple-staking/eth-docker.svg';
import ethereumOnArm from 'assets/partners/simple-staking/ethereum-on-arm.svg';
import ethpillar from 'assets/partners/simple-staking/ethpillar.svg';
import launchnodes from 'assets/partners/simple-staking/launchnodes.svg';
import migalabs from 'assets/partners/simple-staking/migalabs.svg';
import obol from 'assets/partners/simple-staking/obol.svg';
import premia from 'assets/partners/simple-staking/premia.svg';
import rated from 'assets/partners/simple-staking/rated.svg';
import sedge from 'assets/partners/simple-staking/sedge.svg';
import ssv from 'assets/partners/simple-staking/ssv.svg';
import stakely from 'assets/partners/simple-staking/stakely.svg';
import { PromoCard, SecondaryText } from '../components';

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
    partners: [
      { name: 'DAppNode', src: dappnode },
      { name: 'EthPillar', src: ethpillar },
      { name: 'eth-docker', src: ethDocker },
      { name: 'Sedge', src: sedge },
      { name: 'Premia', src: premia },
      { name: 'Ethereum on ARM', src: ethereumOnArm },
    ],
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

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  h3 {
    flex: 1;
  }
`;

const DetailsLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  line-height: 24px;
  text-decoration: none;
  color: var(--lido-app-ui-color-text-active);

  &:hover {
    color: var(--lido-app-ui-color-text-active-hover);
  }
`;

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

const BlocksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 32px;
  row-gap: 24px;
`;

const FullRow = styled.div`
  grid-column: 1 / -1;
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
      <SecondaryText variant="description">{block.description}</SecondaryText>
    </Stack>
  </Stack>
);

export const SimpleStakingCard: FC = () => {
  const { landing } = useExternalLinks(MODULE_NAME.CSM);

  return (
    <PromoCard>
      <Stack direction="column" gap={24} align="stretch">
        <Header>
          <H3>Simple Staking with CSM</H3>
          <DetailsLink
            href={landing}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.csmViewDetails)
            }
          >
            View details
            <IconArrowRight width={20} height={20} />
          </DetailsLink>
        </Header>
        <BlocksGrid>
          <BlockView block={BLOCKS[0]} />
          <BlockView block={BLOCKS[1]} />
          <FullRow>
            <Divider />
          </FullRow>
          <BlockView block={BLOCKS[2]} />
          <BlockView block={BLOCKS[3]} />
        </BlocksGrid>
      </Stack>
    </PromoCard>
  );
};
