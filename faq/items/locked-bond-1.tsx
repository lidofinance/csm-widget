import React from 'react';
import { Faq } from 'types';

export const LockedBond1: Faq = {
  title: 'Why is the bond locked?',
  anchor: 'why-is-the-bond-locked',
  content: (
    <div>
      <p>
        Bond may be locked in the case of delayed penalties, typically for MEV
        stealing event reported by a dedicated committee. This measure ensures
        that node operators are held accountable for any misbehavior or rule
        violations.
      </p>
    </div>
  ),
};
