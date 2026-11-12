import { FC } from 'react';
import {
  IconArrowNarrowUpRight,
  SmallCard,
  Tag,
} from '@lidofinance/lido-app-ui';
import styled from 'styled-components';
import BeaconchaLogo from 'assets/icons/beaconcha.svg?react';
import CsmLogo from 'assets/icons/csm.svg?react';
import EthseerLogo from 'assets/icons/ethseer.svg?react';
import LidoLogo from 'assets/icons/lido.svg?react';
import RatedLogo from 'assets/icons/rated.svg?react';
import { trackMatomoEvent } from 'utils';
import type { Tool, ToolLogo } from './get-tools';

const LOGOS: Record<ToolLogo, FC> = {
  csm: CsmLogo,
  beaconcha: BeaconchaLogo,
  rated: RatedLogo,
  ethseer: EthseerLogo,
  lido: LidoLogo,
};

const PinnedFooterCard = styled(SmallCard)`
  && {
    height: 100%;
  }

  && [class*='SmallCard-module_content'] {
    flex: 1 0 auto;
  }
`;

export const ToolCard: FC<{ tool: Tool }> = ({ tool }) => {
  const Logo = LOGOS[tool.logo];
  return (
    <PinnedFooterCard
      external
      href={tool.href}
      logo={<Logo />}
      icon={<IconArrowNarrowUpRight />}
      title={tool.title}
      description={tool.description}
      footer={<Tag variant={tool.tagVariant}>{tool.category}</Tag>}
      onClick={() => trackMatomoEvent(tool.event)}
      dataTestId={{ root: tool.testid }}
    />
  );
};
