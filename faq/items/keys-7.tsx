import React from 'react';
import { FaqKeyRemovalFee } from 'shared/components';
import { Faq } from 'types';

export const Keys7: Faq = {
  title: 'Why pay for key deletion?',
  anchor: 'why-pay-for-key-deletion',
  content: (
    <div>
      <p>
        Key deletion incurs a removal fee of <FaqKeyRemovalFee />, which is
        deducted from the Node Operator&apos;s bond per each deleted key to
        cover the maximal possible operational costs associated with the queue
        processing. This fee is intended to protect the module from potential
        DoS attacks by malicious actors who could clog the queue with empty
        slots by adding and removing keys, and covers the maximal possible
        operational costs associated with the queue processing. The fee
        discourages misuse, keeping the system clear of invalid keys or keys
        that don&apos;t end up being deposited to.
      </p>
    </div>
  ),
};
