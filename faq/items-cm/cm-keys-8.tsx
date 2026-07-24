import React from 'react';
import { Faq } from 'types';

export const CmKeys8: Faq = {
  title: 'What happens to my keys if my bond drops below the required amount?',
  anchor: 'what-happens-to-my-keys-if-my-bond-drops-below-the-required-amount',
  content: (
    <div>
      <p>
        If your bond falls below the required minimum, some of your keys become{' '}
        <strong>Unbonded</strong> and will not receive new deposits; if the key
        was already deposited or active, an exit will be requested.
      </p>
      <p>To solve this you can either top up the bond, or exit the key.</p>
    </div>
  ),
};
