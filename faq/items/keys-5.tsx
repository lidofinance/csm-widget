import React from 'react';
import { Faq } from 'types';

export const Keys5: Faq = {
  title: 'Difference between bond types (ETH, stETH, wstETH)?',
  anchor: 'difference-between-bond-types',
  content: (
    <div>
      <p>
        Bonds are stored in the form of stETH to so that participation as a Node
        Operator is more capital efficient than if the bond were un-staked (or
        could only be staked if sufficient deposits to fill the submitted
        validators were present). While node operators can submit bond in ETH,
        stETH, or wstETH, any token other than stETH is converted to stETH for
        consistency in bond format.
      </p>
    </div>
  ),
};
