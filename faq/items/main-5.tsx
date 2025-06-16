import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Main5: Faq = {
  title: 'How does CSM work?',
  anchor: 'how-does-csm-work',
  content: (
    <div>
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
