import { ReactNode } from 'react';

// Import score item icons
import EthStakerIcon from 'assets/icons/ics-scores/ethstaker.png';
import StakeCatIcon from 'assets/icons/ics-scores/stakecat.png';
import ObolIcon from 'assets/icons/ics-scores/obol.png';
import SSVIcon from 'assets/icons/ics-scores/ssv.png';
import CSMIcon from 'assets/icons/ics-scores/csm.png';
import SDVTIcon from 'assets/icons/ics-scores/sdvt.png';
import HumanPassportIcon from 'assets/icons/ics-scores/humal-passport.png';
import CirclesIcon from 'assets/icons/ics-scores/circles.png';
import DiscordIcon from 'assets/icons/ics-scores/discord.png';
import XTwitterIcon from 'assets/icons/ics-scores/x.png';
import AragonIcon from 'assets/icons/ics-scores/aragon.png';
import SnapshotIcon from 'assets/icons/ics-scores/snapshot.png';
import GalxeIcon from 'assets/icons/ics-scores/galxe.png';
import HighSignalIcon from 'assets/icons/ics-scores/high-signal.png';
import GitPOAPsIcon from 'assets/icons/ics-scores/git-poap.png';

export type ScoreSource = {
  id: string;
  title: string;
  description: string;
  min: number;
  max: number;
  items: ScoreItem[];
};

export type ScoreItem = {
  name: string;
  logo: string;
  points: number | string;
  description: ReactNode;
};

export const SCORE_SOURCES: ScoreSource[] = [
  {
    id: 'proof-of-experience',
    title: 'Proof-of-Experience',
    description:
      'This group of proofs represents users experience in Ethereum validation',
    min: 4,
    max: 7,
    items: [
      {
        name: 'EthStaker solo-stakers list',
        logo: EthStakerIcon.src,
        points: 6,
        description:
          'Submitted address is present in the latest EthStaker Solo Stakers list as a deposit address, and not excluded following the a Sybil analysis of the list',
      },
      {
        name: 'StakeCat solo-stakers list',
        logo: StakeCatIcon.src,
        points: 6,
        description:
          'Submitted address is present in the latest StakeCat Solo Stakers list (Gnosischain-Solo-Stakers or Solo-Stakers-B), and not excluded following a Sybil analysis of the list',
      },
      {
        name: 'Obol Techne',
        logo: ObolIcon.src,
        points: '4-6',
        description: (
          <>
            Submitted address has the Obol Techne credential assigned:
            <br />- 4 points for Base Credential
            <br />- 5 points for Bronze Credential
            <br />- 6 points for Silver Credential
          </>
        ),
      },
      {
        name: 'SSV Verified operators',
        logo: SSVIcon.src,
        points: 7,
        description:
          'Submitted address is present in the SSV Verified Operators list and does not belong to a professional operator',
      },
      {
        name: 'CSM testnet participation',
        logo: CSMIcon.src,
        points: '4-5',
        description: (
          <>
            4 points are assigned in case:
            <br />- Submitted address belongs to a Node Operator that has been
            active on CSM Testnet for at least 60 days
            <br />- Performance for the Node Operator is above the Performance
            threshold in several of the latest performance oracle reports.
            <br />5 points are assigned in case all the requirements from above
            are met, and the application contains an address that has Circles
            verification
          </>
        ),
      },
      {
        name: 'CSM mainnet participation',
        logo: CSMIcon.src,
        points: 6,
        description: (
          <>
            Submitted address belongs to a Node Operator that has been active on
            CSM Mainnet for at least 30 days
            <br />- Performance for the Node Operator is above the Performance
            threshold in the latest performance oracle report
          </>
        ),
      },
      {
        name: 'SDVTM testnet participation',
        logo: SDVTIcon.src,
        points: 5,
        description:
          'Submitted address participated in and completed the entire duration of a Simple DVT testnet with Obol, SSV, or Safestake as a home or community staker',
      },
      {
        name: 'SDVTM mainnet participation',
        logo: SDVTIcon.src,
        points: 7,
        description:
          'Submitted address is actively participating as a home or community staker in the Lido Simple DVT Module on mainnet at the time of application submission',
      },
    ],
  },
  {
    id: 'proof-of-humanity',
    title: 'Proof-of-Humanity',
    description:
      'This group of proofs allows users to earn a score by being verified by third-party platforms that apply their own rules for identifying real individuals',
    min: 1,
    max: 8,
    items: [
      {
        name: 'Human passport',
        logo: HumanPassportIcon.src,
        points: '3-8',
        description:
          'Submitted address has the corresponding score according to a Lido customized scoring system on Human Passport',
      },
      {
        name: 'Circles',
        logo: CirclesIcon.src,
        points: '3-8',
        description:
          'Submitted address is verified via a dedicated Lido group on Circles',
      },
      {
        name: 'Discord',
        logo: DiscordIcon.src,
        points: 2,
        description: (
          <>
            - Submitted account is registered no less than 1 year ago
            <br />- A unique message with the address applying to be included in
            the list is published from this account to prove ownership
          </>
        ),
      },
      {
        name: 'X',
        logo: XTwitterIcon.src,
        points: 1,
        description: (
          <>
            - Submitted account is registered no less than 1 year ago
            <br />- A unique message with the address applying to be included in
            the list is published from this account to prove ownership
          </>
        ),
      },
    ],
  },
  {
    id: 'proof-of-engagement',
    title: 'Proof-of-Engagement',
    description:
      'This group represents user engagement within the Ethereum and Lido ecosystems',
    min: 1,
    max: 5,
    items: [
      {
        name: 'Participation in Aragon Votes',
        logo: AragonIcon.src,
        points: 2,
        description:
          'Submitted address has voted at least twice with more than 100 LDO',
      },
      {
        name: 'Participation in Snapshot Votes',
        logo: SnapshotIcon.src,
        points: 1,
        description:
          'Submitted address has voted at least three times with more than 100 LDO',
      },
      {
        name: 'Lido Galxe score',
        logo: GalxeIcon.src,
        points: '4-5',
        description: (
          <>
            Submitted address has a score on the Lido Galxe space:
            <br />- 4 points if 4 ≤ Lido Galxe score ≤ 10
            <br />- 5 points if Lido Galxe score {'>'} 10
          </>
        ),
      },
      {
        name: 'Lido High Signal score',
        logo: HighSignalIcon.src,
        points: '2-5',
        description: (
          <>
            Submitted address has a score on the Lido High Signal space:
            <br />- 2 points if 30 ≤ High Signal score ≤ 40
            <br />- 3 points if 40 {'<'} High Signal score ≤ 60
            <br />- 4 points if 60 {'<'} High Signal score ≤ 80
            <br />- 5 points if High Signal score {'>'} 80
          </>
        ),
      },
      {
        name: 'GitPOAPs',
        logo: GitPOAPsIcon.src,
        points: 2,
        description:
          'Submitted address has at least one GitPOAP for contribution to the staking-related public good applications selected by CSM Committee',
      },
    ],
  },
];
