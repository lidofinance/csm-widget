import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const CmMain2: Faq = {
  title: 'What is the difference between CM and CMv2?',
  anchor: 'what-is-the-difference-between-cm-and-cmv2',
  content: (
    <div>
      <p>
        CMv2 is the next version of the Curated Module. It is built for 0x02
        validators with balances up to 2048 ETH, introduces a bond requirement
        for node operators, adds operator types with different parameters, and
        includes on-chain accountability mechanisms.
      </p>
      <p>
        CMv1 was fully reputation-based with no distinction between operators
        and designed around 0x01 validators.
      </p>
      <p>
        <FaqLink href="https://docs.lido.fi/run-on-lido/cm-v2/context-and-background">
          See Context and Background
        </FaqLink>
      </p>
    </div>
  ),
};
