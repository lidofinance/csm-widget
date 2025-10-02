import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const LockedBond2: Faq = {
  title: 'How to unlock the bond?',
  anchor: 'how-to-unlock-the-bond',
  content: (
    <div>
      <p>
        To unlock the bond, the penalty amount, which includes the stolen amount
        and a fixed stealing fine, must be compensated on the &quot;Locked
        bond&quot; tab. This action can be performed from the Manager Address of
        the Node Operator.{' '}
      </p>
      <p>
        If there are disputes regarding the penalty, node operators can start a
        public discussion about the penalty applied on the Lido research forum
        under the{' '}
        <FaqLink href="https://research.lido.fi/c/csm-support/21">
          CSM Support
        </FaqLink>{' '}
        category.
      </p>
    </div>
  ),
};
