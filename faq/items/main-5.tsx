import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Main5: Faq = {
  title: 'How does CSM work?',
  anchor: 'how-does-csm-work',
  content: (
    <div>
      <p>
        CSM consists of two permissionless modules: 0x01 CSM, for validators
        with a balance of 32 ETH, and 0x02 CSM, for validators with a balance of
        up to 2,048 ETH.
      </p>
      <p>
        Refer to{' '}
        <FaqLink href="https://operatorportal.lido.fi/modules/community-staking-module">
          the CSM page
        </FaqLink>{' '}
        for a more detailed explanation of its mechanics and functionalities.
      </p>
    </div>
  ),
};
