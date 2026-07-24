import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const CmLockedBond1: Faq = {
  title: 'Why is the bond locked?',
  anchor: 'why-is-the-bond-locked',
  content: (
    <div>
      <p>
        Bond gets locked when the Curated Module Committee reports a penalty on
        your Node Operator, for example after a slashing event or an EL rewards
        violation. The locked amount covers the losses the protocol incurred.
      </p>
      <p>
        While bond is locked, any shortfall may leave keys unbonded and stop new
        stake allocations.
      </p>
      <p>
        <FaqLink href="https://docs.lido.fi/run-on-lido/cm-v2/penalties">
          See Penalties
        </FaqLink>
      </p>
    </div>
  ),
};
