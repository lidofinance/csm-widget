import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const Keys15: Faq = {
  title: 'What to do in case of technical issues?',
  anchor: 'what-to-do-in-case-of-technical-issues',
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
