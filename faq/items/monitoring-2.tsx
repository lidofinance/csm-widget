import React from 'react';
import { Faq } from 'types';
import { FaqFrameDuration, FaqLink } from 'shared/components';

export const Monitoring2: Faq = {
  title: 'How does the CSM Performance Oracle work?',
  anchor: 'how-does-the-csm-performance-oracle-work',
  content: (
    <div>
      <p>
        The Performance Oracle calculates validators performance based on
        their&nbsp;<code>attestation</code>, <code>block proposal</code>,
        and&nbsp;<code>sync committee participation effectiveness</code>. The
        exact formulas for performance calculation can be found&nbsp;
        <FaqLink href="https://hackmd.io/@lido/csm-v2-tech#Updated-CSM-Performance-Oracle-metric">
          here
        </FaqLink>
        . The Performance Oracle compares the performance of each validator with
        the performance threshold to determine whether the validator should or
        should not be included in the rewards distribution during the frame.
      </p>
      <p>
        The&nbsp;<strong>frame</strong>&nbsp;for the Performance Oracle report
        is set to <FaqFrameDuration />. The Performance Oracle creates a&nbsp;
        <FaqLink href="https://en.wikipedia.org/wiki/Merkle_tree">
          <strong>Merkle tree</strong>
        </FaqLink>
        &nbsp;with the allocation of the Node Operator rewards and delivers the
        root on-chain. To make the original tree available to users, it is
        published on&nbsp;<FaqLink href="https://ipfs.tech/">IPFS</FaqLink>
        &nbsp;and&nbsp;
        <FaqLink href="https://github.com/lidofinance/csm-rewards">
          GitHub
        </FaqLink>
        .{' '}
      </p>
    </div>
  ),
};
