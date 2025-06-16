import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Monitoring2: Faq = {
  title: 'How does the CSM Performance Oracle work?',
  anchor: 'how-does-the-csm-performance-oracle-work',
  content: (
    <div>
      <p>
        The Performance Oracle uses the successful attestation rate
        <code>successfulAttestations / totalAssignedAttestations</code>
        (where <code>successfulAttestation</code> stands for the attestation
        that has been included in the beacon block no matter the inclusion
        distance) as a proxy for the overall performance of a validator. The
        Performance Oracle compares the performance of each validator with the
        performance threshold to determine whether the validator should or
        should not be included in the rewards distribution during the frame.
      </p>
      <p>
        The frame for the Performance Oracle report is set to 28 days. The
        Performance Oracle creates a
        <FaqLink href="https://en.wikipedia.org/wiki/Merkle_tree">
          Merkle tree
        </FaqLink>
        with the allocation of the Node Operator rewards and delivers the root
        on-chain. To make the original tree available to users, it is published
        on
        <FaqLink href="https://ipfs.tech/">IPFS</FaqLink>
        and
        <FaqLink href="https://github.com/lidofinance/csm-rewards">
          GitHub
        </FaqLink>
        .
      </p>
    </div>
  ),
};
