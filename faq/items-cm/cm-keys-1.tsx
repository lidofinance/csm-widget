import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const CmKeys1: Faq = {
  title: 'How much bond is needed?',
  anchor: 'how-much-bond-is-needed',
  content: (
    <div>
      <p>
        Bond is required for every 0x02 key. The exact amount depends on your
        operator type and can be found in{' '}
        <FaqLink href="https://docs.lido.fi/run-on-lido/cm-v2/bond-and-key-management#bond-amounts">
          the Bond section
        </FaqLink>
        .
      </p>
    </div>
  ),
};
