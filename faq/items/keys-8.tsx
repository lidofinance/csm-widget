import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Keys8: Faq = {
  title: "Can't see the key for deletion?",
  anchor: 'cant-see-the-key-for-deletion',
  content: (
    <div>
      <p>
        Only keys that have not been deposited yet can be deleted. If a key has
        already been deposited, the only way to retrieve the bond is{' '}
        <FaqLink href="https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm/exiting-csm-validators">
          to exit the validator on the Consensus Layer (CL)
        </FaqLink>
        . Once withdrawn, the node operator can claim the excess bond.
      </p>
    </div>
  ),
};
