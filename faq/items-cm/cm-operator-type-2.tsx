import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const CmOperatorType2: Faq = {
  title: 'How do I move from PO to PTO?',
  anchor: 'how-do-i-move-from-po-to-pto',
  content: (
    <div>
      <p>
        You can move from PO to PTO if you meet{' '}
        <FaqLink href="https://research.lido.fi/t/node-operator-type-assessment-framework-cmv2/11477#p-25177-graduation-criteria-8">
          the criteria
        </FaqLink>{' '}
        set by the Curated Module Committee.
      </p>
    </div>
  ),
};
