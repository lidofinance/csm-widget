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
        already been deposited, you can either{' '}
        <FaqLink href="https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm/exiting-csm-validators">
          exit the validator on the Consensus Layer (CL)
        </FaqLink>{' '}
        or use the triggerable withdrawals mechanism to eject your validator
        (can be done on the &quot;Keys&quot; &rarr; &quot;Delete&quot; &rarr;
        &quot;Eject&quot; tab). Once withdrawn, the node operator can claim the
        excess bond.
      </p>
    </div>
  ),
};
