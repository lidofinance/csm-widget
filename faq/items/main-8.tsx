import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Main8: Faq = {
  title: 'How can I get help?',
  anchor: 'how-can-i-get-help',
  content: (
    <div>
      <p>
        For community assistance, join the &quot;CSM-mainnet&quot; channel on
        the{' '}
        <FaqLink href="https://discord.com/invite/lido">
          Lido Discord server
        </FaqLink>{' '}
        to seek advice and guidance.
      </p>
    </div>
  ),
};
