import React from 'react';
import { Faq } from 'types';
import { FaqLink } from 'shared/components';

export const CmOperatorType1: Faq = {
  title: 'What is a sub-node operator type and how many can I create?',
  anchor: 'what-is-a-sub-node-operator-type-and-how-many-can-i-create',
  content: (
    <div>
      <p>
        A sub-node operator is a unique operator within your operator group.
        Each sub-operator has its own manager and rewards addresses, bond, and
        keys. You can run multiple sub-operators of different types under a
        single group.
      </p>
      <p>
        Creating sub-operators is a permissioned action governed by the Curated
        Module Committee.
      </p>
      <p>
        <FaqLink href="https://docs.lido.fi/run-on-lido/cm-v2/node-operator-types">
          See Node Operator Types
        </FaqLink>
      </p>
    </div>
  ),
};
