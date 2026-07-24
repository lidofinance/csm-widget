import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const CmKeys2: Faq = {
  title: "Can't see the key for deletion?",
  anchor: 'cant-see-the-key-for-deletion',
  content: (
    <div>
      <p>
        Only keys that have not been deposited yet can be removed. If a key is
        already active, you need to exit the validator.
      </p>
      <p>
        <FaqLink href="https://docs.lido.fi/run-on-lido/cm-v2/bond-and-key-management#exiting-keys">
          See Bond and Key Management
        </FaqLink>
      </p>
    </div>
  ),
};
